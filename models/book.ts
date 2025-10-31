export interface Book {
    id: number;
    title: string;
    author: string;
    published_year?: number;
    isbn?: string;
    pages?: number;
    created_at: string;
    updated_at: string;
  }