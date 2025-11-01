import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.resolve('./data/db.sqlite');

const db = new Database(dbPath, { create: true });

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;