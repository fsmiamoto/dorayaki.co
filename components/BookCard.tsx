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

export default function BookCard({
  book,
  showCover = true,
}: BookCardProps) {
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
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-app-accent text-lg font-bold">
              {firstLetter}
            </div>
          )}
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
