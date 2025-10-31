import { Database } from "bun:sqlite";

const db = new Database("data/db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
