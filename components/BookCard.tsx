"use client";

import Image from "next/image";
import type { Book } from "@/lib/books";
import {
  getGoodreadsIsbnUrl,
  getGoogleBooksIsbnUrl,
  getCoverUrl,
} from "@/lib/books-client";

interface BookCardProps {
  book: Book;
  showCover?: boolean;
}

export default function BookCard({
  book,
  showCover = true,
}: BookCardProps) {
  // Use local cover if available, otherwise fall back to generating URL from ISBN
  const coverImageUrl = book.coverUrl || getCoverUrl(book.isbn, "S");
  const firstLetter = book.title.charAt(0).toUpperCase();

  return (
    <div className="flex gap-3 items-start">
      {/* Cover or First-Letter Avatar */}
      {showCover && (
        <div className="flex-shrink-0 w-16 h-20 rounded overflow-hidden bg-app-surface-muted border border-app-border-subtle relative">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={`Cover of ${book.title}`}
              className="object-cover"
              fill
              sizes="64px"
              onError={(e) => {
                // Fallback to letter avatar on image load error
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.classList.remove("hidden");
                }
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center text-app-accent text-lg font-bold ${coverImageUrl ? "hidden" : ""
              }`}
          >
            {firstLetter}
          </div>
        </div>
      )}

      {/* Book Details */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Title and Star */}
        <div className="flex items-start gap-2">
          <span className="text-app-soft text-sm leading-tight">
            {book.title}
          </span>
          {book.recommended && (
            <span
              className="inline-flex items-center flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded border border-app-amber text-app-amber bg-app-amber/10"
              title="Recommended"
              aria-label="Recommended"
            >
              recommended
            </span>
          )}
        </div>

        {/* Author */}
        {book.author && (
          <div className="text-app-muted text-xs truncate">{book.author}</div>
        )}

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
