"use client";

import { useEffect } from "react";
import { isTypingEvent } from "@/lib/keyboard";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "t" && !isTypingEvent(event)) {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  const label = ready ? `Switch to ${theme === "light" ? "dark" : "light"} theme` : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={`${label} (t)`}
      className="flex h-11 w-11 items-center justify-center rounded-md text-app-muted transition-colors hover:bg-app-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-app-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
        className="theme-icon-sun h-[18px] w-[18px] text-app-amber"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className="theme-icon-moon h-[18px] w-[18px] text-app-info"
      >
        <path d="M20.9 13.4A9 9 0 0 1 10.6 3.1a9 9 0 1 0 10.3 10.3Z" />
      </svg>
    </button>
  );
}
