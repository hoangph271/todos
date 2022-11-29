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
      class="flex flex-col items-center pl-4 rounded border border-gray-200 dark:border-gray-700"
      onSubmit={() => {
        contentEl.current!.innerHTML = contentEditor.current!.getData()
      }}
    >
      <div class="flex items-center h-5">
        <input
          name="is_done"
          type="checkbox"
          id="is_done-checkbox"
          defaultChecked={false}
          class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          placeholder="deadline"
          name="deadline"
          type="datetime-local"
          id="deadline-checkbox"
          defaultChecked={false}
        />
      </div>
      <div class="ml-2 text-sm">
        <label className="flex flex-col">
          <span>Title</span>
          <input
            required
            name="title"
            placeholder="title"
          />
        </label>
        <label htmlFor="content" className="flex flex-col">
          <span>Content</span>
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
