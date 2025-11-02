import { Hono } from 'hono';
import { BookSchema, PartialBookSchema } from '../validators/bookValidator';
import { BookRepository } from '../repositories/book.repositories';
import { ERROR_CODES } from '../utils/result';

const app = new Hono();
const bookRepository = new BookRepository();

app.get('/books', (c) => {
  const result = bookRepository.findAll();
  return c.json(result);
});

app.get('/books/:id', (c) => {
  const id = Number(c.req.param('id'));
  const result = bookRepository.findById(id);
  return c.json(result);
});

app.post('/books', async (c) => {
  const body = await c.req.json();
  const validation = BookSchema.safeParse(body);
  
  if (!validation.success) {
    return c.json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid book data',
        description: 'The provided book data did not pass validation',
        detail: validation.error.errors.map(e => e.message).join(', '),
        actionable: true
      }
    }, 400);
  }

  const result = bookRepository.create(validation.data);
  return c.json(result);
});

app.put('/books/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  
  const validation = PartialBookSchema.safeParse(body);
  if (!validation.success) {
    return c.json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid book data',
        description: 'The provided book data did not pass validation',
        detail: validation.error.errors.map(e => e.message).join(', '),
        actionable: true
      }
    }, 400);
  }

  const result = bookRepository.update(id, validation.data);
  return c.json(result);
});

app.delete('/books/:id', (c) => {
  const id = Number(c.req.param('id'));
  const result = bookRepository.delete(id);
  
  if (!result.error) {
    return c.body(null, 204);
  }
  return c.json(result);
});

export default app;