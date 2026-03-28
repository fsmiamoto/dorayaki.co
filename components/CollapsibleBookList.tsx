"use client";

import { useState } from "react";

interface CollapsibleBookListProps {
  title: string;
  count: number;
  accentColor: string;
  defaultCollapsed: boolean;
  children: React.ReactNode;
}

export default function CollapsibleBookList({
  title,
  count,
  accentColor,
  defaultCollapsed,
  children,
}: CollapsibleBookListProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`flex items-center gap-2 text-xs uppercase tracking-[0.35em] ${accentColor}`}
      >
        <span className="text-app-muted">{collapsed ? "▸" : "▾"}</span>
        {title} ({count})
      </button>
      {!collapsed && children}
    </div>
  );
}
