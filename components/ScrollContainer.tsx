"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { isTypingEvent } from "@/lib/keyboard";

export default function ScrollContainer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;

    const hash = window.location.hash;
    if (hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    scroller.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTypingEvent(event)) return;

      const target = event.target;
      if (target instanceof HTMLElement && target.closest("button, summary")) return;

      const page = Math.max(scroller.clientHeight - 48, 80);
      let delta: number | null = null;

      switch (event.key) {
        case "ArrowDown":
          delta = 48;
          break;
        case "ArrowUp":
          delta = -48;
          break;
        case "PageDown":
          delta = page;
          break;
        case "PageUp":
          delta = -page;
          break;
        case " ":
          delta = event.shiftKey ? -page : page;
          break;
        case "Home":
          scroller.scrollTo({ top: 0 });
          event.preventDefault();
          return;
        case "End":
          scroller.scrollTo({ top: scroller.scrollHeight });
          event.preventDefault();
          return;
        default:
          return;
      }

      scroller.scrollBy({ top: delta });
      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      ref={ref}
      id="scroll-root"
      className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-gutter:stable]"
    >
      {children}
    </div>
  );
}
