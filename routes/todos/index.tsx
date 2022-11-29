import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts"
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import sanitizeHtml from 'npm:sanitize-html'
import CreateTodoForm from '../../islands/CreateTodoForm.tsx';
import DeleteTodoButton from '../../islands/DeleteTodoButton.tsx';

import { getTodos, putTodo, deleteTodo } from '../../storage/index.ts';
import { AnyEntity, Todo } from '../../storage/types.ts';

type TodoItemProps = Todo
const TodoItem = ({ _id, title, isDone, content, deadline }: TodoItemProps) => {
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
      <div class={`ml-2 flex-grow-1 text-sm ${isDone && 'text-gray-900 dark:text-gray-300'}`}>
        {content ? (
          <details>
            <summary>{ title }</summary>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              class="text-xs font-normal"
            />
          </details>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            class="text-xs font-normal"
          />
        )}
        {deadline && (
          <p class="text-xs font-normal">
            {deadline.toLocaleString()}
          </p>
        )}
      </div>
      <DeleteTodoButton
        _id={_id}
      />
    </div>
  )
}

export default function Home ({ data: todos }: PageProps<Todo[]>) {
  return (
    <>
      <Head>
        <title>#Todos</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        {todos.map((todo) => {
          return (
            <TodoItem {...todo} />
          )
        })}
        <CreateTodoForm />
      </div>
    </>
  );
}

export const handler: Handlers<Todo[]> = {
  async GET(_, ctx) {
    return ctx.render(await getTodos())
  },
  async DELETE(req, ctx) {
    const { _id } = await req.json() as AnyEntity

    await deleteTodo(_id)

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
