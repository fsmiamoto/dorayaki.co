"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import clsx from "clsx";

const SESSION_KEY = "dorayaki-booted";
const CHAR_DELAY = 35; // ms per character — fast typist feel
const OUTPUT_FADE_DELAY = 100; // ms after typing finishes before output appears
const NEXT_SECTION_DELAY = 250; // ms after output appears before next section starts

interface Section {
  command: string;
  showCursorWhenDone?: boolean;
  contentClassName?: string;
  children?: ReactNode;
}

interface TerminalBootProps {
  sections: Section[];
  user?: string;
  directory?: string;
}

/**
 * Renders the prompt prefix: `user@dorayaki : directory $`
 * Replicates CommandPrompt's prompt line exactly.
 */
function PromptPrefix({ user, directory }: { user: string; directory: string }) {
  return (
    <>
      <span className="prompt">{user}@dorayaki</span>
      <span className="text-app-faint">:</span>
      <span className="text-app-foreground">{directory}</span>
      <span className="prompt-glow text-app-faint">$</span>
    </>
  );
}

/**
 * Static render — all sections visible, no animation.
 * Used for SSR, repeat visits (sessionStorage), and reduced-motion.
 */
function StaticRender({ sections, user, directory }: TerminalBootProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-1 text-[0.78rem] leading-relaxed text-app-muted sm:text-sm">
            <PromptPrefix user={user ?? "fmiamoto"} directory={directory ?? "~"} />
            <span className="command text-app-foreground">{section.command}</span>
            {section.showCursorWhenDone && <span className="cursor" />}
          </div>
          {section.children && (
            <div
              className={clsx(
                "space-y-3 text-xs leading-relaxed text-app-soft sm:text-sm",
                section.contentClassName,
              )}
            >
              {section.children}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TerminalBoot({
  sections,
  user = "fmiamoto",
  directory = "~",
}: TerminalBootProps) {
  // null = not yet determined, true = skip, false = animate
  const [skipAnimation, setSkipAnimation] = useState<boolean | null>(null);

  // Animation state
  const [activeIndex, setActiveIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [visibleOutputs, setVisibleOutputs] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // On mount: determine whether to animate
  useEffect(() => {
    const alreadyBooted = !!sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSkipAnimation(alreadyBooted || prefersReduced);
    return clear;
  }, [clear]);

  // Typing engine
  useEffect(() => {
    if (skipAnimation !== false || done) return;

    if (activeIndex >= sections.length) {
      setDone(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }

    const command = sections[activeIndex].command;

    if (charIndex < command.length) {
      // Type next character
      timerRef.current = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, CHAR_DELAY);
    } else {
      // Command finished typing → show output → move to next
      timerRef.current = setTimeout(() => {
        setVisibleOutputs((prev) => new Set([...prev, activeIndex]));

        timerRef.current = setTimeout(() => {
          setActiveIndex((i) => i + 1);
          setCharIndex(0);
        }, NEXT_SECTION_DELAY);
      }, OUTPUT_FADE_DELAY);
    }

    return clear;
  }, [skipAnimation, done, activeIndex, charIndex, sections, clear]);

  // SSR / pre-determination: render everything for crawlers & no-JS
  if (skipAnimation === null || skipAnimation === true) {
    return <StaticRender sections={sections} user={user} directory={directory} />;
  }

  // Animated render
  const isAnimDone = done;

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        // Only show sections up to the currently active one
        const visible = isAnimDone || index <= activeIndex;
        if (!visible) return <div key={index} aria-hidden />;

        // Command text: fully typed for past sections, partially for active
        const isCurrent = !isAnimDone && index === activeIndex;
        const isPast = isAnimDone || index < activeIndex;
        const displayCommand = isPast
          ? section.command
          : isCurrent
            ? section.command.slice(0, charIndex)
            : "";

        // Cursor: during typing on active section, or when done if showCursorWhenDone
        const showCursor = isAnimDone ? !!section.showCursorWhenDone : isCurrent;

        // Output visibility
        const showOutput = visibleOutputs.has(index) || isAnimDone;

        return (
          <div key={index} className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-1 text-[0.78rem] leading-relaxed text-app-muted sm:text-sm">
              <PromptPrefix user={user} directory={directory} />
              {displayCommand && (
                <span className="command text-app-foreground">{displayCommand}</span>
              )}
              {showCursor && <span className="cursor" />}
            </div>
            {section.children && showOutput && (
              <div
                className={clsx(
                  "animate-fade-in-up space-y-3 text-xs leading-relaxed text-app-soft sm:text-sm",
                  section.contentClassName,
                )}
              >
                {section.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
