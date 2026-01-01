"use client";

import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const iconCommon = "h-4 w-4";

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={iconCommon} {...props}>
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5.22 5.22l1.42 1.42" />
      <path d="M17.36 17.36l1.42 1.42" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5.22 18.78l1.42-1.42" />
      <path d="M17.36 6.64l1.42-1.42" />
    </g>
  </svg>
);

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={iconCommon} {...props}>
    <path d="M21 12.79A9 9 0 0111.21 3 6.5 6.5 0 0012 21a9 9 0 009-8.21z" fill="currentColor" />
  </svg>
);

export default function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";
  const label = `Switch to ${nextTheme} theme`;

  if (!mounted) {
    return <div className="h-11 w-11 rounded-full border border-app-border bg-app-surface-muted" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface text-app-muted shadow-pane-soft transition-colors hover:bg-app-surface-muted hover:text-app-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent disabled:opacity-70"
      disabled={!ready}
    >
      <span className="sr-only">{label}</span>
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
