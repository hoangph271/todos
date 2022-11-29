import { useState } from "preact/hooks"
import { DbTodo, StyledProps } from "../types.ts"
import EditTodoForm from "./EditTodoForm.tsx"

type EditTodoButtonProps = {
  todo: DbTodo
}

export default function EditTodoButton ({ todo }: StyledProps<EditTodoButtonProps>) {
  return (
      <a
        className="m-1 text-white bg-blue-600 border-blue-600 border-2 border-transparent px-2 py-1 hover:bg-blue-900"
        href={`/todos/${todo._id}`}
      >
        <span>Edit</span>
      </a>
  )
}