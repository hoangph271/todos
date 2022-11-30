import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import sanitizeHtml from 'npm:sanitize-html'
import * as path from "https://deno.land/std@0.102.0/path/mod.ts";
import * as marked from "npm:marked";

type Note = {
  filepath: string
  content?: string
  children?: Note[]
  isDirectory: boolean
}

export default function Home ({ data: note }: PageProps<Note>) {
  return (
    <>
      <Head>
        <title>{ note.filepath }</title>
      </Head>
      <div>
        <h1 className="text-blue-900 mb-2">{ note.filepath }</h1>
        {note.isDirectory ? (
          <>
            <ul>
              {note.children?.map(note => (
                <a
                  key={note.filepath}
                  href={`/notes?filepath=${note.filepath}`}
                  className="block text-blue-600 hover:text-blue-900 hover:underline"
                >
                  { note.filepath }
                </a>
              ))}
            </ul>
            <div>
              TODO: Editor
            </div>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: `
                ${sanitizeHtml(marked.parse(note.content!, {
                  gfm: true,
                  async: true,
                  breaks: true,
                  headerIds: true,
                }))}
              `
            }}
          />
        )}
      </div>
    </>
  );
}

const NOTES_PATH = path.join(Deno.cwd(), 'storage', 'notes')
const sanitizeFilepath = (filepath: string) => {
  return filepath.replace(NOTES_PATH, '')
}

const asyncMap = async <T, V>(items: AsyncIterable<T>, handler: (item: T) => V) => {
  const results: V[] = []

  for await (const item of items) {
    results.push(handler(item))
  }

  return results
}
const getNote = async (req: Request): Promise<Note> => {
  const url = new URL(req.url).searchParams.get('filepath') ?? '/'
  const filepath = path.join(NOTES_PATH, url)

  const { isDirectory } = await Deno.stat(filepath)

  if (isDirectory) {
    const children = await asyncMap(await Deno.readDir(filepath), item => {
      return {
        filepath: sanitizeFilepath(path.join(filepath, item.name)),
        isDirectory: item.isDirectory,
      }
    })

    return {
      filepath: sanitizeFilepath(filepath),
      children,
      isDirectory
    }
  }

  const noteContent = await Deno.readTextFile(filepath)

  return {
    filepath: sanitizeFilepath(filepath),
    content: noteContent,
    isDirectory
  }
}

export const handler: Handlers<Note> = {
  async GET(req, ctx) {
    return ctx.render(await getNote(req))
  }
}
