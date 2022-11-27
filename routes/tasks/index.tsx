import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts"
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

import { getTodos, putTodo } from '../../storage/index.ts';

import { Todo } from '../../storage/types.ts';

export default function Home ({ data: todos }: PageProps<Todo[]>) {
  return (
    <>
      <Head>
        <title>#Tasks</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        {todos.map(({ _id, title, isDone, content, deadline }) => {
          return (
            <div
              class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center">
                <input
                  id={`bordered-checkbox-${_id}`}
                  type="checkbox"
                  checked={isDone}
                  disabled={isDone}
                  aria-describedby={`todo-checkbox-text`}
                  class="w-4 h-4 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div class={`ml-2 text-sm ${isDone && 'text-gray-900 dark:text-gray-300'}`}>
                <label
                  for={`bordered-checkbox-${_id}`}
                  class="py-4 ml-2 w-full text-sm font-medium"
                >
                  { title }
                </label>
                  {deadline && (
                    <p class="text-xs font-normal">
                      {deadline.toLocaleString()}
                    </p>
                  )}
                  {content && (
                    <p id="todo-checkbox-text" class="text-xs font-normal">
                      {content}
                    </p>
                  )}
              </div>
            </div>
          )
        })}
      </div>
      <form
        method="post"
        encType="multipart/form-data"
        class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700"
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
          <input
            required
            name="title"
            placeholder="title"
          />
          <textarea
            name="content"
            placeholder="content"
            class="text-xs font-normal text-gray-500 dark:text-gray-300"
          >
          </textarea>
        </div>
        <button type="submit">
          Create
        </button>
      </form>
    </>
  );
}

export const handler: Handlers<Todo[]> = {
  async GET(_, ctx) {
    return ctx.render(await getTodos())
  },
  async POST(req, ctx) {
    const form = await multiParser(req)

    if (!form) throw new Error('panic!: Bad form NOT handled')

    const todo: Todo = {
      _id: nanoid(),
      title: form.fields.title,
      isDone: form.fields.is_done === 'on',
      content: form.fields.content ?? '',
      deadline: form.fields.deadline
        ? new Date(form.fields.deadline)
        : undefined
    }

    await putTodo(todo)

    return ctx.render(await getTodos())
  }
}
