"use client";

import { useState } from "react";
import BookCard from "@/components/BookCard";
import CommandPrompt from "@/components/CommandPrompt";
import type { Book } from "@/lib/books";

type ReadingTab = "reading" | "finished" | "queue";

interface ReadingTabsProps {
  readingBooks: Book[];
  finishedBooks: Book[];
  queueBooks: Book[];
}

const tabs: ReadingTab[] = ["reading", "finished", "queue"];

const tabCommands: Record<ReadingTab, string> = {
  reading: 'ls books | grep "status=reading"',
  finished: 'ls books | grep "status=finished"',
  queue: 'ls books | grep "status=queue"',
};

const tabAccent: Record<ReadingTab, string> = {
  reading: "text-app-accent hover:border-app-accent",
  finished: "text-app-amber hover:border-app-amber",
  queue: "text-app-info hover:border-app-info",
};

function BookList({
  books,
  emptyState = "No books found.",
}: {
  books: Book[];
  emptyState?: string;
}) {
  if (books.length === 0) {
    return <div className="text-sm text-app-muted">{emptyState}</div>;
  }

  return (
    <div className="space-y-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} showCover={true} />
      ))}
    </div>
  );
}

export default function ReadingTabs({ readingBooks, finishedBooks, queueBooks }: ReadingTabsProps) {
  const [activeTab, setActiveTab] = useState<ReadingTab>("reading");
  const booksByTab: Record<ReadingTab, Book[]> = {
    reading: readingBooks,
    finished: finishedBooks,
    queue: queueBooks,
  };
  const counts = Object.fromEntries(tabs.map((tab) => [tab, booksByTab[tab].length])) as Record<
    ReadingTab,
    number
  >;

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-3 text-xs tracking-[0.3em] sm:text-sm"
        role="tablist"
        aria-label="Reading list filter"
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              id={`books-tab-${tab}`}
              type="button"
              role="tab"
              aria-controls="books-tabpanel"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`link-pill ${tabAccent[tab]} ${
                isActive ? "bg-app-surface-muted/60 border-current text-app-foreground" : ""
              }`}
            >
              [{tab}:{counts[tab]}]
            </button>
          );
        })}
      </div>

      <CommandPrompt command={tabCommands[activeTab]} showCursor>
        <div
          id="books-tabpanel"
          role="tabpanel"
          aria-labelledby={`books-tab-${activeTab}`}
          className="space-y-5"
        >
          <BookList books={booksByTab[activeTab]} />
        </div>
      </CommandPrompt>
    </div>
  );
}
