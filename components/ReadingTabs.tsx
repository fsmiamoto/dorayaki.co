"use client";

import { useState } from "react";
import clsx from "clsx";
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
        className="flex flex-wrap gap-2 text-[13px]"
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
              className={clsx(
                "rounded border px-3 py-[3px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent",
                isActive
                  ? "border-app-accent bg-app-surface text-app-accent"
                  : "border-app-border-subtle text-app-muted hover:border-app-muted hover:text-app-foreground",
              )}
            >
              {tab}: {counts[tab]}
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
