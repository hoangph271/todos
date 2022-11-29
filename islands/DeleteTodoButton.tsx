type DeleteTodoButtonProps = {
  _id: string
}

export default function DeleteTodoButton ({ _id }: DeleteTodoButtonProps) {
  return (
    <button
      className="m-1 text-white bg-red-600 border-red-600 border-2 border-transparent px-2 py-1 hover:bg-red-900"
      onClick={async e => {
        e.preventDefault()

        await fetch('/todos', { method: 'DELETE', body: JSON.stringify({ _id }) })

        window.location.href = '/todos'
      }}
    >
      Delete
    </button>
  )
}