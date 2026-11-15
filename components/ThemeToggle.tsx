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
      className="rounded border border-app-border-subtle px-2 py-px text-app-muted transition-colors hover:border-app-muted hover:text-app-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
    >
      <span className="theme-label-dark">dark</span>
      <span className="theme-label-light">light</span>
    </button>
  );
}
