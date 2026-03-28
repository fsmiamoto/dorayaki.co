"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/lib/books";
import {
  getGoodreadsIsbnUrl,
  getGoogleBooksIsbnUrl,
  getGoogleBooksCoverUrl,
  getOpenLibraryCoverUrl,
} from "@/lib/books-client";

type CoverSource = "google" | "openLibrary" | "avatar";

interface BookCardProps {
  book: Book;
  showCover?: boolean;
}

export default function BookCard({ book, showCover = true }: BookCardProps) {
  const [coverSource, setCoverSource] = useState<CoverSource>("google");
  const firstLetter = book.title.charAt(0).toUpperCase();

  // Get cover URL based on current source
  const getCoverImageUrl = (): string | null => {
    if (!book.isbn) return null;
    switch (coverSource) {
      case "google":
        return getGoogleBooksCoverUrl(book.isbn);
      case "openLibrary":
        return getOpenLibraryCoverUrl(book.isbn, "S");
      case "avatar":
        return null;
    }
  };

  const handleImageError = () => {
    // Cascade through sources: google -> openLibrary -> avatar
    if (coverSource === "google") {
      setCoverSource("openLibrary");
    } else if (coverSource === "openLibrary") {
      setCoverSource("avatar");
    }
  };

  const coverImageUrl = getCoverImageUrl();

  return (
    <div className="-m-2 flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-app-surface-muted">
      {/* Cover or First-Letter Avatar */}
      {showCover && (
        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded border border-app-border-subtle bg-app-surface-muted">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={`Cover of ${book.title}`}
              className="object-cover"
              fill
              sizes="64px"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-app-accent">
              {firstLetter}
            </div>
          )}
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
