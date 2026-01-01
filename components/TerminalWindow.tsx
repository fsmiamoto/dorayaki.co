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
  return (
    <div className={clsx("terminal-window isolate", className)}>
      <div className="terminal-title-bar justify-between">
        <div className="flex items-center gap-2">
          <span className="terminal-button terminal-button-red" />
          <span className="terminal-button terminal-button-amber" />
          <span className="terminal-button terminal-button-green" />
        </div>
        <div className="text-app-text-muted font-mono text-xs opacity-60">{title}</div>
        <div className="w-[52px]" /> {/* Balances the 3 buttons (12px * 3 + gap) roughly */}
      </div>
      <div className="terminal-content px-4 py-4 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}
