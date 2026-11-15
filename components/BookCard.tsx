import BookCover from "@/components/BookCover";
import type { Book } from "@/lib/books";
import { getGoodreadsIsbnUrl, getGoogleBooksIsbnUrl } from "@/lib/books-client";

interface BookCardProps {
  book: Book;
  showCover?: boolean;
}

export default function BookCard({ book, showCover = true }: BookCardProps) {
  return (
    <div className="-m-2 flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-app-surface-muted">
      {/* Cover or First-Letter Avatar */}
      {showCover && (
        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded border border-app-border-subtle bg-app-surface-muted">
          <BookCover book={book} sizes="64px" />
        </div>
      )}

      {/* Book Details */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Title and Star */}
        <div className="flex items-start gap-2">
          <span className="text-sm leading-tight text-app-soft">{book.title}</span>
          {book.recommended && (
            <span
              className="bg-app-amber/10 inline-flex flex-shrink-0 items-center rounded border border-app-amber px-1.5 py-0.5 font-mono text-[10px] text-app-amber"
              title="Recommended"
              aria-label="Recommended"
            >
              recommended
            </span>
          )}
        </div>

        {/* Author */}
        {book.author && <div className="truncate text-xs text-app-muted">{book.author}</div>}

        {/* Book Links */}
        <div className="flex gap-3 text-xs">
          <a
            href={getGoodreadsIsbnUrl(book.isbn)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-muted"
          >
            goodreads
          </a>
          <a
            href={getGoogleBooksIsbnUrl(book.isbn)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-muted"
          >
            google
          </a>
        </div>
      </div>
    </div>
  );
}
