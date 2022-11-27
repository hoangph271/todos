export type Todo = {
  _id: string
  title: string
  isDone?: boolean
  content?: string
  deadline?: Date
}

export type DbTodo = Omit<Todo, 'deadline'> & {
  deadline?: string
}

export type TodosDbData = {
  todos: DbTodo[]
}