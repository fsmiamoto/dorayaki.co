"use client";

import { ReactNode } from "react";

interface StaggerRevealProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export default function StaggerReveal({ children, index, className = "" }: StaggerRevealProps) {
  const delay = index * 150;

  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
