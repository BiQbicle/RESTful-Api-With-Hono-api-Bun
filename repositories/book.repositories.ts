import type { Book } from '../models/book';
import { Result, ERROR_CODES } from '../utils/result';
import db from '../db/index';

export class BookRepository {
  findAll(): Result<Book[]> {
    try {
      const books = db.prepare('SELECT * FROM books').all() as Book[];
      return { data: books };
    } catch (error) {
      return {
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: 'Failed to retrieve books',
          description: 'An error occurred while fetching books',
          detail: error instanceof Error ? error.message : 'Unknown error',
          actionable: false
        }
      };
    }
  }

  findById(id: number): Result<Book | null> {
    try {
      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id) as Book | undefined;
      
      if (!book) {
        return {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: `Book with id ${id} not found`,
            description: 'The requested book does not exist',
            detail: `No book found with ID ${id}`,
            actionable: true
          }
        };
      }

      return { data: book };
    } catch (error) {
      return {
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: 'Failed to retrieve book',
          description: 'An error occurred while searching for the book',
          detail: error instanceof Error ? error.message : 'Unknown error',
          actionable: false
        }
      };
    }
  }

  create(bookData: { title: string; author: string; year?: number }): Result<Book> {
    try {
      const stmt = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)');
      const result = stmt.run(bookData.title, bookData.author, bookData.year || null);
      
      const newBook: Book = {
        id: result.lastInsertRowid as number,
        title: bookData.title,
        author: bookData.author,
        year: bookData.year
      };
      return { data: newBook };
    } catch (error) {
      return {
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: 'Failed to create book',
          description: 'An error occurred while inserting the book',
          detail: error instanceof Error ? error.message : 'Unknown error',
          actionable: false
        }
      };
    }
  }

  update(id: number, bookData: { title?: string; author?: string; year?: number }): Result<Book | null> {
    try {
      const existing = this.findById(id);
      if (existing.error) {
        return existing;
      }
      
      if (!existing.data) {
        return {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: `Book with id ${id} not found`,
            description: 'Cannot update a non-existent book',
            detail: `No book found with ID ${id}`,
            actionable: true
          }
        };
      }

      const currentBook = existing.data;
      const stmt = db.prepare('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?');
      const result = stmt.run(
        bookData.title !== undefined ? bookData.title : currentBook.title,
        bookData.author !== undefined ? bookData.author : currentBook.author,
        bookData.year !== undefined ? bookData.year : currentBook.year,
        id
      );
      
      if (result.changes === 0) {
        return {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: `Book with id ${id} not found`,
            description: 'Cannot update a non-existent book',
            detail: `No book found with ID ${id}`,
            actionable: true
          }
        };
      }

      return this.findById(id);
    } catch (error) {
      return {
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: `Failed to update book ${id}`,
          description: 'An error occurred while updating the book',
          detail: error instanceof Error ? error.message : 'Unknown error',
          actionable: false
        }
      };
    }
  }

  delete(id: number): Result<boolean> {
    try {
      const stmt = db.prepare('DELETE FROM books WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        return {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: `Book with id ${id} not found`,
            description: 'Cannot delete a non-existent book',
            detail: `No book found with ID ${id}`,
            actionable: true
          }
        };
      }

      return { data: true };
    } catch (error) {
      return {
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: `Failed to delete book ${id}`,
          description: 'An error occurred while deleting the book',
          detail: error instanceof Error ? error.message : 'Unknown error',
          actionable: false
        }
      };
    }
  }
}