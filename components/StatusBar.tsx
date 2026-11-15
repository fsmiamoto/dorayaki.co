"use client";

import { usePathname } from "next/navigation";

const pathsWithPostRows = ["/", "/posts", "/posts/"];

export default function StatusBar({ year }: { year: number }) {
  const pathname = usePathname();
  const path = pathname === "/" ? "" : pathname.replace(/\/$/, "");

  return (
    <footer className="flex h-7 items-center overflow-hidden whitespace-nowrap border-t border-app-border-subtle bg-app-surface text-xs text-app-muted">
      <span className="flex h-full shrink-0 items-center bg-app-accent px-3 font-bold text-app-accent-ink">
        NORMAL
      </span>
      <span className="min-w-0 truncate px-3.5">~/dorayaki.co{path}</span>
      <span className="ml-auto flex shrink-0">
        <span className="hidden px-3.5 md:inline">
          {pathsWithPostRows.includes(pathname) && (
            <>
              <kbd className="text-app-foreground">j</kbd>/
              <kbd className="text-app-foreground">k</kbd> move ·{" "}
              <kbd className="text-app-foreground">enter</kbd> open ·{" "}
            </>
          )}
          <kbd className="text-app-foreground">t</kbd> theme
        </span>
        <span className="hidden px-3.5 md:inline">utf-8</span>
        <span className="px-3.5">© {year} Flavio Miyamoto</span>
      </span>
    </footer>
  );
}
