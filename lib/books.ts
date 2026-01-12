import fs from "fs";
import path from "path";

export type BookStatus = "reading" | "finished" | "queue";

export interface Book {
  id: string;
  title: string;
  author: string | null;
  isbn: string;
  status: BookStatus;
  recommended: boolean;
  coverUrl: string | null;
}

export interface BooksData {
  lastUpdated: string;
  books: Book[];
}

const booksPath = path.join(process.cwd(), "content/books.json");

/**
 * Load all books from JSON file
 */
export function getAllBooks(): Book[] {
  try {
    const fileContents = fs.readFileSync(booksPath, "utf8");
    const data: BooksData = JSON.parse(fileContents);
    return data.books;
  } catch (error) {
    console.error("Error reading books.json:", error);
    return [];
  }
}

/**
 * Get books filtered by status
 */
export function getBooksByStatus(status: BookStatus): Book[] {
  const allBooks = getAllBooks();
  return allBooks.filter((book) => book.status === status);
}

/**
 * Get only recommended books
 */
export function getRecommendedBooks(): Book[] {
  const allBooks = getAllBooks();
  return allBooks.filter((book) => book.recommended);
}

