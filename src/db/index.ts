import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { drizzle } from "drizzle-orm/sqlite-proxy"
import { SQLocalDrizzle } from "sqlocal/drizzle"
import * as schema from "./schema"
import setup from "./setup.sql?raw"
const { driver } = new SQLocalDrizzle("database.sqlite3")
console.debug({ setup })
await driver(setup, [], "run")
const db = drizzle(driver, { schema })
export default db
export type Insert<TName extends keyof typeof schema> = InferInsertModel<
  (typeof schema)[TName]
>

export type Select<TName extends keyof typeof schema> = InferSelectModel<
  (typeof schema)[TName]
>
