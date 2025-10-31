import { Hono } from "hono";
import { books } from "./routes/books";

const app = new Hono();

app.route("/books", books);

const port = 3000;
console.log(` Server running at http://localhost:${port}`);
export default app;