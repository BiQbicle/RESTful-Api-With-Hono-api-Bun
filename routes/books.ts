import { Hono } from "hono";
import db from "../db/index";
import { BookSchema } from "../validators/bookValidator";

export const books = new Hono();

books.get("/", (c) => {
  const query = db.query("SELECT * FROM books");
  const data = query.all();
  return c.json({ data });
});

books.get("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const query = db.query("SELECT * FROM books WHERE id = ?");
  const book = query.get(id);
  if (!book)
    return c.json({ error: { code: "NOT_FOUND", message: "Book not found" } }, 404);
  return c.json({ data: book });
});

books.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = BookSchema.safeParse(body);
  if (!parsed.success)
    return c.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
      400
    );

  const { title, author, year } = parsed.data;
  const insert = db.query(
    "INSERT INTO books (title, author, year) VALUES (?, ?, ?)"
  );
  insert.run(title, author, year);

  const book = db.query("SELECT * FROM books ORDER BY id DESC LIMIT 1").get();
  return c.json({ data: book }, 201);
});

books.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const parsed = BookSchema.partial().safeParse(body);
  if (!parsed.success)
    return c.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
      400
    );

  const existing = db.query("SELECT * FROM books WHERE id = ?").get(id);
  if (!existing)
    return c.json({ error: { code: "NOT_FOUND", message: "Book not found" } }, 404);

  const { title, author, year } = { ...existing, ...parsed.data };
  db.query("UPDATE books SET title=?, author=?, year=? WHERE id=?").run(
    title,
    author,
    year,
    id
  );

  const updated = db.query("SELECT * FROM books WHERE id = ?").get(id);
  return c.json({ data: updated });
});

books.delete("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const del = db.query("DELETE FROM books WHERE id = ?");
  const result = del.run(id);
  if (result.changes === 0)
    return c.json({ error: { code: "NOT_FOUND", message: "Book not found" } }, 404);
  return c.json({ data: { deleted: true } });
});
