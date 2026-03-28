import type { Book } from "@/lib/books";
import BookCard from "@/components/BookCard";
import CollapsibleBookList from "@/components/CollapsibleBookList";

interface BookSectionProps {
  title: string;
  books: Book[];
  accentColor?: string;
  emptyMessage?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export default function BookSection({
  title,
  books,
  accentColor = "text-app-accent",
  emptyMessage = "No books in this section.",
  collapsible = false,
  defaultCollapsed = false,
}: BookSectionProps) {
  const bookList =
    books.length === 0 ? (
      <div className="text-sm text-app-muted">{emptyMessage}</div>
    ) : (
      <div className="space-y-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} showCover={true} />
        ))}
      </div>
    );

  return (
    <section className="space-y-4">
      {collapsible ? (
        <CollapsibleBookList
          title={title}
          count={books.length}
          accentColor={accentColor}
          defaultCollapsed={defaultCollapsed}
        >
          {bookList}
        </CollapsibleBookList>
      ) : (
        <div className="space-y-3">
          <h2 className={`text-xs uppercase tracking-[0.35em] ${accentColor}`}>{title}</h2>
          {bookList}
        </div>
      )}
    </section>
  );
}
