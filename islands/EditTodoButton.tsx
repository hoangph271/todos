import { useState } from "preact/hooks"
import { DbTodo, StyledProps } from "../types.ts"
import EditTodoForm from "./EditTodoForm.tsx"

type EditTodoButtonProps = {
  todo: DbTodo
}

export default function EditTodoButton ({ todo }: StyledProps<EditTodoButtonProps>) {
  const [isEditing, setIsEditing] = useState(false)

  return (
      <button
        className="m-1 text-white bg-blue-600 border-blue-600 border-2 border-transparent px-2 py-1 hover:bg-blue-900"
        onClick={() => {
          setIsEditing(true)
        }}
      >
        <span>Edit</span>
        {isEditing && (
          <dialog open className="bg-white flex items-center justify-center absolute h-screen w-screen inset-0">
            <EditTodoForm
              todo={todo}
              onCancel={() => { setIsEditing(false) }}
            />
          </dialog>
        )}
      </button>
  )
}