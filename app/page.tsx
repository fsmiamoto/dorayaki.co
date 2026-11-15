import { Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import CommandPrompt from "@/components/CommandPrompt";
import PostList from "@/components/PostList";
import { getAllPostSummaries } from "@/lib/posts";
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

const facts = [
  { key: "role", value: "Software Engineer @ Sakana AI", color: "text-app-purple" },
  { key: "where", value: "Tokyo, Japan", color: "text-app-amber" },
  { key: "writes", value: "systems, AI agents, engineering culture", color: "text-app-info" },
  {
    key: "into",
    value: "operating systems, networking, embedded systems, compilers, human languages",
    color: "text-app-pink",
  },
];

const swatches = [
  "bg-app-accent",
  "bg-app-info",
  "bg-app-purple",
  "bg-app-pink",
  "bg-app-amber",
  "bg-app-danger",
  "bg-app-muted",
  "bg-app-foreground",
];

export default function Home() {
  const posts = getAllPostSummaries();
  const firstYear = posts.at(-1)?.date.slice(0, 4);

  return (
    <div className="space-y-[52px]">
      <CommandPrompt command="neofetch" showCursor={false}>
        <div className="grid gap-[18px] sm:grid-cols-[176px_1fr] sm:items-start sm:gap-8">
          <Image
            src="/avatar.png"
            alt="Flavio Miyamoto"
            width={176}
            height={176}
            className="h-24 w-24 rounded-lg border border-app-border-subtle sm:h-44 sm:w-44"
            priority
          />
          <div>
            <p className="text-xl font-bold tracking-tight">
              <span className="text-app-accent">flavio</span>
              <span className="text-app-faint">@</span>
              <span className="text-app-info">dorayaki</span>
            </p>
            <div aria-hidden="true" className="mb-2 mt-0.5 text-app-faint">
              ----------------
            </div>
            <dl className="grid grid-cols-[8ch_1fr] gap-x-3.5 gap-y-[3px] text-[13px] sm:text-sm">
              <dt className="font-bold text-app-accent">name</dt>
              <dd>
                <h1 className="font-normal tracking-normal text-app-soft">Flavio Miyamoto</h1>
              </dd>
              {facts.map(({ key, value, color }) => (
                <Fragment key={key}>
                  <dt className={clsx("font-bold", color)}>{key}</dt>
                  <dd>{value}</dd>
                </Fragment>
              ))}
            </dl>
            <div aria-hidden="true" className="mt-4 flex">
              {swatches.map((swatch) => (
                <span key={swatch} className={clsx("h-[18px] w-[30px]", swatch)} />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
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
          </div>
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
    </div>
  );
}
