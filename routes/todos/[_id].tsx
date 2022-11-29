import { PageProps, Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";

import EditTodoForm from "../../islands/EditTodoForm.tsx";
import { getTodoById } from "../../storage/index.ts";
import { DbTodo } from "../../types.ts";

export default function EditTodo ({ data: todo }: PageProps<DbTodo>) {
  return (
    <EditTodoForm todo={todo} />
  )
}


export const handler: Handlers<DbTodo> = {
  async GET (_, ctx) {
    const todo = await getTodoById(ctx.params._id)

    if (!todo) return ctx.renderNotFound()

    return ctx.render(todo)
  }
}