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
  {
    label: "GitHub",
    href: "https://github.com/fsmiamoto",
    icon: "M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 008.012 10.928c.585.11.8-.254.8-.566 0-.28-.01-1.022-.016-2.007-3.258.708-3.945-1.571-3.945-1.571-.531-1.35-1.296-1.71-1.296-1.71-1.06-.725.08-.711.08-.711 1.172.083 1.788 1.205 1.788 1.205 1.04 1.781 2.732 1.267 3.4.969.105-.753.407-1.267.74-1.558-2.6-.296-5.334-1.3-5.334-5.783 0-1.277.456-2.32 1.205-3.136-.121-.297-.523-1.494.114-3.115 0 0 .985-.315 3.23 1.197a11.26 11.26 0 015.88 0c2.244-1.512 3.228-1.197 3.228-1.197.639 1.621.237 2.818.116 3.115.75.816 1.203 1.859 1.203 3.136 0 4.495-2.738 5.484-5.346 5.775.418.36.79 1.07.79 2.156 0 1.557-.014 2.812-.014 3.193 0 .315.212.68.806.565A11.5 11.5 0 0023.5 12C23.5 5.648 18.352.5 12 .5z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/fsmiamoto/",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.851 0-2.135 1.445-2.135 2.939v5.667H9.354V9h3.413v1.561h.047c.476-.9 1.637-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.002-4.124 2.062 2.062 0 01-.002 4.124zM7.114 20.452H3.56V9h3.555v11.452z",
  },
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
              Software Engineer @ Sakana AI
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
        <div className="mt-5 flex gap-2">
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-9 w-9 items-center justify-center rounded border border-app-border-subtle text-app-soft hover:border-app-accent hover:text-app-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className="h-[18px] w-[18px]"
              >
                <path fill="currentColor" d={icon} />
              </svg>
            </a>
          ))}
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
