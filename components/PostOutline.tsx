"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import TerminalWindow from "@/components/TerminalWindow";
import type { PostHeading } from "@/lib/post-headings";

interface PostOutlineProps {
  headings: PostHeading[];
  variant: "desktop" | "mobile";
}

function useActiveHeading(headings: PostHeading[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (headingElements.length === 0) {
      return;
    }

    const updateActiveHeading = () => {
      const upperReadingThreshold = 96;
      const distanceToDocumentEnd = Math.max(
        0,
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight),
      );
      // Sweep the threshold down near the document end so short final sections
      // can each become active even when they cannot reach the usual top offset.
      const endProgress = 1 - Math.min(distanceToDocumentEnd / window.innerHeight, 1);
      const readingThreshold =
        upperReadingThreshold + (window.innerHeight * 0.6 - upperReadingThreshold) * endProgress;
      let nextActiveId = headingElements[0].id;

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top > readingThreshold) {
          break;
        }
        nextActiveId = heading.id;
      }

      const isAtDocumentEnd =
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;

      if (isAtDocumentEnd) {
        nextActiveId = headingElements.at(-1)?.id ?? nextActiveId;
      }

      setActiveId(nextActiveId);
    };

    let animationFrame = 0;
    const scheduleUpdate = () => {
      if (animationFrame !== 0) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateActiveHeading();
      });
    };
    const observer = new IntersectionObserver(scheduleUpdate, {
      rootMargin: "-96px 0px 0px 0px",
      threshold: [0, 1],
    });

    headingElements.forEach((heading) => observer.observe(heading));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updateActiveHeading();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [headings]);

  return activeId;
}

function OutlineLinks({ headings }: { headings: PostHeading[] }) {
  const activeId = useActiveHeading(headings);

  return (
    <ul className="space-y-1.5">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <li key={heading.id} className={clsx(heading.outlineDepth === 3 && "pl-4")}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={clsx(
                "group flex items-start gap-2 rounded px-2 py-1.5 text-xs leading-relaxed transition-colors sm:text-sm",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent",
                isActive
                  ? "bg-app-surface-soft text-app-accent"
                  : "hover:bg-app-surface-soft/60 text-app-muted hover:text-app-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={clsx(
                  "mt-px shrink-0 transition-opacity",
                  isActive ? "text-app-accent opacity-100" : "opacity-0 group-hover:opacity-50",
                )}
              >
                ▸
              </span>
              <span>{heading.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function OutlineCommand() {
  return (
    <p className="mb-4 flex items-baseline gap-2 text-xs text-app-foreground sm:text-sm">
      <span className="prompt-glow text-app-accent" aria-hidden="true">
        $
      </span>
      <span>headings post.md</span>
    </p>
  );
}

export default function PostOutline({ headings, variant }: PostOutlineProps) {
  if (variant === "mobile") {
    return (
      <details className="bg-app-surface-soft/40 group rounded-lg border border-app-border-subtle xl:hidden">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-app-foreground marker:text-app-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent">
          On this page
        </summary>
        <nav aria-label="On this page" className="border-t border-app-border-subtle px-3 py-4">
          <OutlineCommand />
          <OutlineLinks headings={headings} />
        </nav>
      </details>
    );
  }

  return (
    <aside className="sticky top-6 hidden self-start xl:block">
      <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg">
        <TerminalWindow title="outline" windowNumber={2} literalTitle>
          <nav aria-label="On this page">
            <OutlineCommand />
            <OutlineLinks headings={headings} />
          </nav>
        </TerminalWindow>
      </div>
    </aside>
  );
}
