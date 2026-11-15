"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
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
    <ul className="border-l border-app-border-subtle">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={clsx(
                "-ml-px block border-l py-1 text-xs leading-relaxed transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent",
                heading.outlineDepth === 3 ? "pl-6" : "pl-3",
                isActive
                  ? "border-app-accent text-app-foreground"
                  : "border-transparent text-app-muted hover:text-app-accent",
              )}
            >
              {heading.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function PostOutline({ headings, variant }: PostOutlineProps) {
  if (variant === "mobile") {
    return (
      <details className="mb-6 rounded border border-app-border-subtle lg:hidden">
        <summary className="cursor-pointer select-none px-3.5 py-2.5 text-[13px] text-app-foreground marker:text-app-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent">
          On this page
        </summary>
        <nav aria-label="On this page" className="border-t border-app-border-subtle px-3.5 py-3">
          <OutlineLinks headings={headings} />
        </nav>
      </details>
    );
  }

  return (
    <aside className="sticky top-16 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto lg:block">
      <nav aria-label="On this page">
        <p className="mb-2.5 text-xs text-app-faint"># on this page</p>
        <OutlineLinks headings={headings} />
      </nav>
    </aside>
  );
}
