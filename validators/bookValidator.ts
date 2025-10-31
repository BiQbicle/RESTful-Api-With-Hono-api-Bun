import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int().optional(),
});

export type BookInput = z.infer<typeof BookSchema>;