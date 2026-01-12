/**
 * Generate Open Library cover URL from ISBN
 * @param isbn - The book's ISBN
 * @param size - Cover size: S (small), M (medium), L (large). Default is S.
 * @returns Cover URL or null if no ISBN provided
 */
export function getCoverUrl(
  isbn: string | null,
  size: "S" | "M" | "L" = "S",
): string | null {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

/**
 * Generate Goodreads URL from ISBN
 */
export function getGoodreadsIsbnUrl(isbn: string): string {
  return `https://www.goodreads.com/book/isbn/${isbn}`;
}

/**
 * Generate Google Books URL from ISBN
 */
export function getGoogleBooksIsbnUrl(isbn: string): string {
  return `https://books.google.com/books?vid=ISBN${isbn}`;
}
