"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/lib/books";
import { getGoogleBooksCoverUrl, getOpenLibraryCoverUrl } from "@/lib/books-client";

type CoverSource = "custom" | "google" | "openLibrary" | "avatar";

interface BookCoverProps {
  book: Book;
  sizes: string;
  openLibrarySize?: "S" | "M" | "L";
}

export default function BookCover({ book, sizes, openLibrarySize = "S" }: BookCoverProps) {
  const [coverSource, setCoverSource] = useState<CoverSource>(book.coverUrl ? "custom" : "google");

  const getCoverImageUrl = (): string | null => {
    if (!book.isbn) return null;
    switch (coverSource) {
      case "custom":
        return book.coverUrl;
      case "google":
        return getGoogleBooksCoverUrl(book.isbn);
      case "openLibrary":
        return getOpenLibraryCoverUrl(book.isbn, openLibrarySize);
      case "avatar":
        return null;
    }
  };

  const handleImageError = () => {
    // Cascade through sources: custom -> google -> openLibrary -> avatar
    if (coverSource === "custom") {
      setCoverSource("google");
    } else if (coverSource === "google") {
      setCoverSource("openLibrary");
    } else if (coverSource === "openLibrary") {
      setCoverSource("avatar");
    }
  };

  const coverImageUrl = getCoverImageUrl();

  if (!coverImageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-app-accent">
        {book.title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={coverImageUrl}
      alt={`Cover of ${book.title}`}
      className="object-cover"
      fill
      sizes={sizes}
      onError={handleImageError}
    />
  );
}
