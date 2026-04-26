"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
}

export default function Typewriter({ text, speed = 30, delay = 300 }: TypewriterProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"waiting" | "typing" | "done">("waiting");

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCharIndex(text.length);
      setPhase("done");
      return;
    }

    const timer = setTimeout(() => setPhase("typing"), delay);
    return () => clearTimeout(timer);
  }, [delay, text.length]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (charIndex >= text.length) {
      setPhase("done");
      return;
    }

    const timer = setTimeout(() => setCharIndex((c) => c + 1), speed);
    return () => clearTimeout(timer);
  }, [phase, charIndex, text.length, speed]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, charIndex)}
        {phase === "typing" && <span className="cursor" />}
      </span>
    </>
  );
}
