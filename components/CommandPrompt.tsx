import { ReactNode } from "react";
import clsx from "clsx";

interface CommandPromptProps {
  directory?: string;
  command?: string;
  children?: ReactNode;
  showCursor?: boolean;
  className?: string;
  contentClassName?: string;
}

export default function CommandPrompt({
  directory = "~",
  command,
  children,
  showCursor = true,
  className,
  contentClassName,
}: CommandPromptProps) {
  return (
    <div className={className}>
      <div className="mb-[18px] flex flex-wrap items-baseline gap-x-2.5 text-[13px] text-app-muted">
        <span className="text-app-info">{directory}</span>
        <span className="font-bold text-app-accent">❯</span>
        {command && <span className="text-app-foreground">{command}</span>}
        {showCursor && <span className="cursor" />}
      </div>
      {children && (
        <div className={clsx("text-sm leading-relaxed text-app-soft", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
