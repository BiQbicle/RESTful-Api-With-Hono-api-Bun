import { Hono } from 'hono';
import { BookSchema, PartialBookSchema } from '../validators/bookValidator';
import { BookRepository } from '../repositories/book.repositories';

const app = new Hono();
const bookRepository = new BookRepository();

app.get('/books', (c) => {
  const result = bookRepository.findAll();
  
  return result.error 
    ? c.json(result, 500)
    : c.json(result.data, 200);
});

app.get('/books/:id', (c) => {
  const id = Number(c.req.param('id'));
  const result = bookRepository.findById(id);
  
  return result.error
    ? c.json(result.error, 404)
    : result.data
      ? c.json(result.data, 200)
      : c.json({ message: 'Book not found' }, 404);
});

app.post('/books', async (c) => {
  const body = await c.req.json();
  
  const validation = BookSchema.safeParse(body);
  if (!validation.success) {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid book data',
        details: validation.error.errors
      }
    }, 400);
  }

  const result = bookRepository.create(validation.data);
  
  return result.error
    ? c.json(result.error, 409)
    : c.json(result.data, 201);
});

app.put('/books/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  
  const validation = PartialBookSchema.safeParse(body);
  if (!validation.success) {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid book data',
        details: validation.error.errors
      }
    }, 400);
  }

  const result = bookRepository.update(id, validation.data);
  
  return result.error
    ? c.json(result.error, 404)
    : result.data
      ? c.json(result.data, 200)
      : c.json({ message: 'Book not found' }, 404);
});

app.delete('/books/:id', (c) => {
  const id = Number(c.req.param('id'));
  const result = bookRepository.delete(id);
  
  return result.error
    ? c.json(result.error, 404)
    : c.json({ message: 'Book deleted successfully' }, 200);
});
export default app;