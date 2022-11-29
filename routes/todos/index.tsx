import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts"
import sanitizeHtml from 'npm:sanitize-html'
import { nanoid } from 'https://deno.land/x/nanoid@v3.0.0/nanoid.ts';

import EditTodoForm from '../../islands/EditTodoForm.tsx';
import DeleteTodoButton from '../../islands/DeleteTodoButton.tsx';
import EditTodoButton from '../../islands/EditTodoButton.tsx';
import { getTodos, postTodo, deleteTodo, putTodo } from '../../storage/index.ts';
import { AnyEntity, DbTodo } from '../../types.ts';

type TodoItemProps = {
  todo: DbTodo
}
const TodoItem = ({ todo }: TodoItemProps) => {
  const { _id, title, isDone, content, deadline } = todo

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
          <p class="text-xs font-bold">
            { title }
          </p>
        )}
        {deadline && (
          <p class="text-xs font-normal">
            {new Date(deadline).toLocaleString()}
          </p>
        )}
      </div>
      <EditTodoButton
        todo={todo}
      />
      <DeleteTodoButton
        _id={_id}
      />
    </div>
  )
}

export default function Home ({ data: todos }: PageProps<DbTodo[]>) {
  return (
    <>
      <Head>
        <title>#Todos</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        {todos.map((todo) => {
          return (
            <TodoItem todo={todo} />
          )
        })}
        <EditTodoForm />
      </div>
    </>
  );
}

export const handler: Handlers<DbTodo[]> = {
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

    const todo: DbTodo = {
      _id: form.fields._id,
      title: form.fields.title,
      isDone: form.fields.is_done === 'on',
      content: form.fields.content ?? '',
      deadline: form.fields.deadline,
    }

    if (todo._id) {
      await putTodo(todo)
    } else {
      await postTodo({
        ...todo,
        _id: nanoid()
      })
    }

    return ctx.render(await getTodos())
  }
}
