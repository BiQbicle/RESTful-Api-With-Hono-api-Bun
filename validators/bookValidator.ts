import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional()
});

export const PartialBookSchema = BookSchema.partial();

