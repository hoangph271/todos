export type AnyEntity = {
  _id: string
}

export type DbTodo = {
  _id: string
  title: string
  isDone?: boolean
  content?: string
  deadline?: string
}

export type TodosDbData = {
  todos: DbTodo[]
}

export type StyledProps<T> = { className?: string } & T
