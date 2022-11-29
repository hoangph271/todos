import { useRef } from "preact/hooks"
import MarkdownEditor from "./MarkdownEditor.tsx"
import * as _ from 'npm:@types/ckeditor'

export default function CreateTodoForm () {
  const contentEditor = useRef<CKEDITOR.editor>()
  const contentEl = useRef<HTMLTextAreaElement>(null)

  return (
    <form
      method="post"
      encType="multipart/form-data"
      style={{ width: 'fit-content' }}
      className="flex m-auto mt-2 flex-col items-center rounded border items-stretch"
      onSubmit={() => {
        contentEl.current!.innerHTML = contentEditor.current!.getData()
      }}
    >
      <div className="">
        <label className="">
          <span>Done:</span>
          <input
            name="is_done"
            type="checkbox"
            id="is_done-checkbox"
            defaultChecked={false}
            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </label>
        <label className="flex flex-col">
          <span>Deadline:</span>
          <input
            placeholder="deadline"
            name="deadline"
            type="datetime-local"
            id="deadline-checkbox"
            defaultChecked={false}
          />
        </label>
      </div>
      <div className="flex flex-col">
        <label className="flex flex-col">
          <span>Title:</span>
          <input
            required
            name="title"
            placeholder="title"
          />
        </label>
        <label htmlFor="content" className="flex flex-col">
          <span>Content:</span>
          <MarkdownEditor ref={contentEditor} />
          <textarea ref={contentEl} id="content" style="display: none;" name="content" />
        </label>
      </div>
      <button type="submit" className="border-2 px-2 py-1">
        Create
      </button>
    </form>
  )
}
