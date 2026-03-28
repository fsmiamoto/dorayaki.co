import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import BookSection from "@/components/BookSection";
import { getBooksByStatus, getBooksLastUpdated } from "@/lib/books";
import type { Metadata } from "next";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reading List - dorayaki",
  description: "My attempt to document what I'm reading",
  alternates: {
    canonical: withTrailingSlash("/reading"),
  },
  openGraph: {
    title: "Reading List - dorayaki",
    description: "My attempt to document what I'm reading",
    url: absoluteUrl(withTrailingSlash("/reading")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reading List - dorayaki",
    description: "My attempt to document what I'm reading",
  },
};

export default function ReadingPage() {
  const readingBooks = getBooksByStatus("reading");
  const finishedBooks = getBooksByStatus("finished");
  const queueBooks = getBooksByStatus("queue");
  const lastUpdated = getBooksLastUpdated();

  return (
    <div className="space-y-6">
      <TerminalWindow title="reading.md">
        <CommandPrompt
          command="cat reading.md"
          showCursor={false}
          contentClassName="space-y-8 text-sm leading-relaxed sm:text-base"
        >
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-app-foreground sm:text-4xl">
              Reading List
            </h1>
            <p className="text-app-soft">
              A running log of the books that shape how I think about software, systems, and people.
              Suggestions are always welcome.
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-app-muted">
              Last update: {lastUpdated}
            </p>
          </header>

          <div className="space-y-8">
            <BookSection
              title="Currently Reading"
              books={readingBooks}
              accentColor="text-app-accent"
            />

            <BookSection
              title="Finished"
              books={finishedBooks}
              accentColor="text-app-amber"
              collapsible={true}
              defaultCollapsed={true}
            />

            <BookSection title="Reading Queue" books={queueBooks} accentColor="text-app-info" />
          </div>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  );
}
