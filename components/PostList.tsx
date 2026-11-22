"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { isTypingEvent } from "@/lib/keyboard";
import type { PostSummary } from "@/lib/posts";

interface PostListProps {
  posts: PostSummary[];
  groupByYear?: boolean;
  emptyState?: string;
}

export default function PostList({
  posts,
  groupByYear = false,
  emptyState = "No posts found.",
}: PostListProps) {
  const [selected, setSelected] = useState(0);
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingEvent(event)) {
        return;
      }

      if (event.key === "j" || event.key === "k") {
        const next = Math.min(
          posts.length - 1,
          Math.max(0, selected + (event.key === "j" ? 1 : -1)),
        );
        setSelected(next);
        rows.current[next]?.focus({ preventScroll: true });
        rows.current[next]?.scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" && document.activeElement === document.body) {
        rows.current[selected]?.click();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [posts.length, selected]);

  if (posts.length === 0) {
    return <div className="text-app-muted">{emptyState}</div>;
  }

  return (
    <div className="-mx-3.5">
      {posts.map((post, index) => {
        const isSelected = index === selected;
        const year = post.date.slice(0, 4);
        const startsYear = groupByYear && year !== posts[index - 1]?.date.slice(0, 4);

        return (
          <Fragment key={post.slug}>
            {startsYear && (
              <div className="flex items-center gap-3 px-3.5 pb-1.5 pt-5 text-xs text-app-faint first:pt-0">
                <span>{year}</span>
                <span className="flex-1 border-t border-app-border-subtle" />
              </div>
            )}
            <Link
              ref={(row) => {
                rows.current[index] = row;
              }}
              href={`/posts/${post.slug}`}
              onMouseEnter={() => {
                if (!rows.current.some((row) => row === document.activeElement)) {
                  setSelected(index);
                }
              }}
              onFocus={() => setSelected(index)}
              data-selected={isSelected || undefined}
              className={clsx(
                "grid scroll-mb-4 scroll-mt-4 grid-cols-[1fr_auto] gap-x-[18px] gap-y-1 rounded-r-md border-l-2 px-3.5 py-3 sm:grid-cols-[104px_1fr_auto]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-app-accent",
                isSelected ? "border-app-accent bg-app-surface" : "border-transparent",
              )}
            >
              <time dateTime={post.date} className="pt-0.5 text-[13px] text-app-muted">
                {post.date}
              </time>
              <div className="col-span-full row-start-2 min-w-0 sm:col-span-1 sm:row-start-auto">
                <h3
                  className={clsx(
                    "text-base font-bold leading-snug tracking-tight transition-colors",
                    isSelected ? "text-app-accent" : "text-app-foreground",
                  )}
                >
                  {post.frontMatter.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-app-muted">
                  {post.excerpt}
                  {post.frontMatter.tags?.map((tag) => (
                    <span key={tag} className="text-app-faint">
                      {" "}
                      #{tag.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  ))}
                </p>
              </div>
              <span className="col-start-2 row-start-1 pt-[3px] text-xs text-app-amber sm:col-start-auto sm:row-start-auto">
                {post.readingTime.replace(" read", "")}
              </span>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
