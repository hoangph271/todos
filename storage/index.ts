import type { DbTodo, Todo, TodosDbData } from './types.ts'
import { Low } from 'npm:lowdb'
import { JSONFile } from 'npm:lowdb/node'

// TODO: BIG - what about RC...?

const loadTodosDb = async () => {
  const TODOS_DB_PATH = './storage/todos.json'
  const dbAdapter = new JSONFile<TodosDbData>(TODOS_DB_PATH)
  const todosDb = new Low(dbAdapter)

  await todosDb.read()

  if (!todosDb.data) {
    throw new Error(`${TODOS_DB_PATH} NOT exists`)
  }

  return todosDb
}
const intoDbTodo = (todo: Todo): DbTodo => {
  return {
    ...todo,
    deadline: todo.deadline?.toUTCString(),
  }
}

const withTodosDbWrite = async <T>(handler: (loadTodosDb: Low<TodosDbData>) => Promise<T>) => {
  const todosDb = await loadTodosDb()

  try {
    await handler(todosDb)
  } finally {
    await todosDb.write()
  }
}

export const putTodo = async (todo: Todo) => {
  const dbTodo = intoDbTodo(todo)
  const todosDb = await loadTodosDb()

  todosDb.data!.todos.push(dbTodo)

  await todosDb.write()
}

export const getTodos = async (): Promise<Todo[]> => {
  return (await loadTodosDb()).data!.todos
    .map(todo => {
      return {
        ...todo,
        deadline: todo.deadline
          ? new Date(todo.deadline)
          : undefined
      }
    })
}

export const deleteTodo = async (_id: string) => {
  await withTodosDbWrite(async todosDb => {
    const index = todosDb.data!.todos.findIndex(todo => todo._id === _id)

    await todosDb.data!.todos.splice(index, 1)
  })
}