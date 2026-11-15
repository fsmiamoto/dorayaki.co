import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import CommandPrompt from "@/components/CommandPrompt";
import PostList from "@/components/PostList";
import BookCover from "@/components/BookCover";
import { getAllPostSummaries } from "@/lib/posts";
import { getBooksByStatus } from "@/lib/books";
import projects from "@/content/projects.json";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "dorayaki",
  description: "personal blog of a Flavio Miyamoto",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "dorayaki",
    description: "personal blog of a Flavio Miyamoto",
    url: absoluteUrl("/"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dorayaki",
    description: "personal blog of a Flavio Miyamoto",
  },
};

const links = [
  { label: "github", href: "https://github.com/fsmiamoto" },
  { label: "linkedin", href: "https://www.linkedin.com/in/fsmiamoto/" },
  { label: "rss", href: "/feed.xml" },
];

const languageColors: Record<string, string> = {
  Rust: "#dea584",
  TypeScript: "#3178c6",
  Go: "#00add8",
};

const SHELF_SIZE = 5;

export default function Home() {
  const posts = getAllPostSummaries();
  const firstYear = posts.at(-1)?.date.slice(0, 4);
  const readingBooks = getBooksByStatus("reading");
  const shelfCounts = [
    ["reading", readingBooks.length],
    ["finished", getBooksByStatus("finished").length],
    ["queue", getBooksByStatus("queue").length],
  ] as const;

  return (
    <div className="space-y-[52px]">
      <CommandPrompt command="whoami" showCursor={false}>
        <div className="grid grid-cols-[72px_1fr] items-center gap-4 sm:grid-cols-[104px_1fr] sm:gap-6">
          <Image
            src="/avatar.png"
            alt="Flavio Miyamoto"
            width={104}
            height={104}
            className="rounded-lg border border-app-border-subtle"
            priority
          />
          <div>
            <h1 className="mb-1.5 text-[22px] font-bold leading-tight tracking-tight sm:text-[28px]">
              Flavio Miyamoto
            </h1>
            <p className="text-app-muted">
              Software Development Engineer @ Amazon
              <span className="mx-1.5 text-app-faint">·</span>
              Tokyo, Japan
            </p>
          </div>
        </div>
        <p className="mt-[22px] max-w-[62ch] text-[15px]">
          Software engineer writing about <span className="highlight">systems</span>,{" "}
          <span className="highlight">AI agents</span>, and{" "}
          <span className="highlight">engineering culture</span>. Also interested in operating
          systems, networking, embedded systems, compilers, and human language learning.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-app-border-subtle px-3 py-[3px] text-app-soft hover:border-app-accent hover:text-app-accent"
            >
              {label}
              <span aria-hidden="true" className="ml-1.5 text-app-faint">
                ↗
              </span>
            </a>
          ))}
          <span className="ml-auto hidden text-[13px] italic text-app-muted sm:inline">
            Tweaking dotfiles...
          </span>
        </div>
      </CommandPrompt>

      <CommandPrompt command="ls -lt posts/ | head -5" showCursor={false}>
        <h2 className="sr-only">Latest posts</h2>
        <PostList posts={posts.slice(0, 5)} />
        <div className="mt-3.5 flex items-center gap-4 text-[13px] text-app-faint">
          <Link href="/posts" className="hover:underline">
            posts/ →
          </Link>
          <span>
            {posts.length} posts since {firstYear}
          </span>
        </div>
      </CommandPrompt>

      <CommandPrompt command="ls projects/" showCursor={false}>
        <h2 className="sr-only">Projects</h2>
        <div className="grid gap-x-7 border-t border-app-border-subtle sm:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-app-border-subtle py-[13px]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold text-app-info group-hover:underline">{project.name}/</h3>
                <span className="flex items-center gap-1.5 text-xs text-app-muted">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: languageColors[project.language] }}
                  />
                  {project.language}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-app-muted">{project.description}</p>
            </a>
          ))}
        </div>
      </CommandPrompt>

      <CommandPrompt command="grep reading reading.md">
        <h2 className="sr-only">Currently reading</h2>
        <div className="-mx-4 grid grid-cols-[repeat(5,104px)] gap-[18px] overflow-x-auto px-4 py-1 sm:mx-0 sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {readingBooks.slice(0, SHELF_SIZE).map((book) => (
            <Link key={book.id} href="/reading" className="group block">
              <div className="relative aspect-[2/2.85] overflow-hidden rounded border border-app-border-subtle bg-app-surface-muted transition-transform duration-200 group-hover:-translate-y-1">
                <BookCover
                  book={book}
                  sizes="(min-width: 640px) 160px, 104px"
                  openLibrarySize="M"
                />
              </div>
              <span className="mt-2 block text-xs leading-snug text-app-muted">
                {book.title.split(/[:―]/)[0].trim()}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-[18px] flex flex-wrap gap-2.5 text-[13px] text-app-muted">
          {shelfCounts.map(([status, count]) => (
            <span key={status}>
              [<span className="text-app-foreground">{status}</span>: {count}]
            </span>
          ))}
          <Link href="/reading" className="ml-auto hover:underline">
            reading.md →
          </Link>
        </div>
      </CommandPrompt>
    </div>
  );
}
