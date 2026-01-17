/**
 * Generate Google Books cover URL from ISBN
 * @param isbn - The book's ISBN
 * @returns Cover URL
 */
export function getGoogleBooksCoverUrl(isbn: string): string {
  return `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`;
}

/**
 * Generate Open Library cover URL from ISBN
 * @param isbn - The book's ISBN
 * @param size - Cover size: S (small), M (medium), L (large). Default is S.
 * @returns Cover URL or null if no ISBN provided
 */
export function getOpenLibraryCoverUrl(
  isbn: string | null,
  size: "S" | "M" | "L" = "S",
): string | null {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

/**
 * Generate cover URL from ISBN using Google Books as primary source
 * @param isbn - The book's ISBN
 * @returns Cover URL or null if no ISBN provided
 */
export function getCoverUrl(isbn: string | null): string | null {
  if (!isbn) return null;
  return getGoogleBooksCoverUrl(isbn);
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
