import { Hono } from 'hono';
import bookRoutes from './routes/books.ts';

const app = new Hono();

app.route('/api', bookRoutes);

export default {
  port: 3000,
  fetch: app.fetch
};