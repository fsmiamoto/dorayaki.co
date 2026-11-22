"use client";

import { usePathname } from "next/navigation";
import TokyoClock from "@/components/TokyoClock";

const pathsWithPostRows = ["/", "/posts", "/posts/"];

export default function StatusBar({ year }: { year: number }) {
  const pathname = usePathname();
  const path = pathname === "/" ? "" : pathname.replace(/\/$/, "");

  return (
    <footer className="shrink-0 border-t border-app-border-subtle bg-app-surface pb-[env(safe-area-inset-bottom)] text-xs text-app-muted">
      <div className="flex h-7 items-center overflow-hidden whitespace-nowrap">
        <span className="flex h-full shrink-0 items-center bg-app-accent px-2.5 font-bold text-app-accent-ink sm:px-3">
          NORMAL
        </span>
        <span className="min-w-0 truncate px-2.5 sm:px-3.5">~/dorayaki.co{path}</span>
        <span className="ml-auto flex h-full shrink-0 items-center">
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
          <TokyoClock compact className="px-2.5 md:hidden" />
          <span className="px-2.5 sm:px-3.5">
            © {year}
            <span className="hidden sm:inline"> Flavio Miyamoto</span>
          </span>
        </span>
      </div>
    </footer>
  );
}
