import type { DbTodo, TodosDbData } from '../types.ts'
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

const withTodosDbWrite = async <T>(handler: (loadTodosDb: Low<TodosDbData>) => T | Promise<T>) => {
  const todosDb = await loadTodosDb()

  try {
    await handler(todosDb)
  } finally {
    await todosDb.write()
  }
}

export const postTodo = async (dbTodo: DbTodo) => {
  await withTodosDbWrite((todosDb) => {
    todosDb.data!.todos.push(dbTodo)
  })
}

export const putTodo = async (dbTodo: DbTodo) => {
  await withTodosDbWrite((todosDb) => {
    const index = todosDb.data!.todos.findIndex(todo => todo._id === dbTodo._id)

    todosDb.data!.todos.splice(index, 1, dbTodo)
  })
}

export const getTodos = async (): Promise<DbTodo[]> => {
  return (await loadTodosDb()).data!.todos
}

export const deleteTodo = async (_id: string) => {
  await withTodosDbWrite(async todosDb => {
    const index = todosDb.data!.todos.findIndex(todo => todo._id === _id)

    await todosDb.data!.todos.splice(index, 1)
  })
}