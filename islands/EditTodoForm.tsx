import { useRef } from "preact/hooks"
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4"

import MarkdownEditor from "./MarkdownEditor.tsx"
import * as _ from 'npm:@types/ckeditor'
import { DbTodo, StyledProps } from "../types.ts"

type EditTodoFormProps = {
  todo?: DbTodo
}
export default function EditTodoForm ({ todo, className }: StyledProps<EditTodoFormProps>) {
  const contentEditor = useRef<CKEDITOR.editor>()
  const contentEl = useRef<HTMLTextAreaElement>(null)

  return (
    <form
      action="/todos/"
      method="post"
      encType="multipart/form-data"
      style={{ width: 'fit-content' }}
      className={className ?? '' + ' flex flex-col items-center rounded border items-stretch'}
      onSubmit={() => {
        contentEl.current!.innerHTML = contentEditor.current!.getData()
      }}
    >
      <div className="">
        {todo && (
          <input type="text" style={{ display: 'none' }} name="_id" id="_id" value={todo._id} />
        )}
        <label className="">
          <span>Done:</span>
          <input
            name="is_done"
            type="checkbox"
            id="is_done-checkbox"
            defaultChecked={todo?.isDone ?? false}
            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </label>
        <label className="flex flex-col">
          <span>Deadline:</span>
          <input
            value={todo?.deadline ? dayjs(todo?.deadline).format('YYYY-MM-DDThh:mm') : ''}
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
            value={todo?.title}
            name="title"
            placeholder="title"
          />
        </label>
        <label htmlFor="content" className="flex flex-col">
          <span>Content:</span>
          <MarkdownEditor ref={contentEditor} initialContent={todo?.content} />
          <textarea ref={contentEl} id="content" style="display: none;" name="content" />
        </label>
      </div>
      <div className="flex justify-between">
        <button type="submit" className="flex-grow-1 border-2 px-2 py-1 bg-sky-200 hover:bg-sky-400">
          {todo ? 'Edit' : 'Create'}
        </button>
        {todo && (
          <button
            onClick={() => {
              window.location.href = '/todos/'
            }}
            type="button"
            className="flex-grow-1 border-2 px-2 py-1 bg-sky-200 hover:bg-sky-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
