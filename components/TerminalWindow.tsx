import { ReactNode } from "react";
import clsx from "clsx";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function TerminalWindow({
  title = "fish ~",
  children,
  className = "",
}: TerminalWindowProps) {
  const displayTitle = title.includes("/") || title.includes("~") ? title : `~/${title}`;

  return (
    <div className={clsx("terminal-window isolate", className)}>
      <div className="terminal-title-bar relative">
        <div className="flex items-center gap-2">
          <span className="terminal-button terminal-button-red" />
          <span className="terminal-button terminal-button-amber" />
          <span className="terminal-button terminal-button-green" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center">
          <span className="font-mono text-xs text-app-faint">[1]</span>
          <span className="ml-2 font-mono text-xs text-app-muted opacity-60">{displayTitle}</span>
        </div>
      </div>
      <div className="terminal-content px-4 py-4 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}
