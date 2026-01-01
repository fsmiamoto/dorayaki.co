import { ReactNode } from "react";
import clsx from "clsx";

interface CommandPromptProps {
  user?: string;
  directory?: string;
  command?: string;
  children?: ReactNode;
  showCursor?: boolean;
  className?: string;
  contentClassName?: string;
}

export default function CommandPrompt({
  user = "fmiamoto",
  directory = "~",
  command,
  children,
  showCursor = true,
  className,
  contentClassName,
}: CommandPromptProps) {
  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex flex-wrap items-baseline gap-1 text-[0.78rem] leading-relaxed text-app-muted sm:text-sm">
        <span className="prompt">{user}@dorayaki</span>
        <span className="text-app-faint">:</span>
        <span className="text-app-foreground">{directory}</span>
        <span className="text-app-faint">$</span>
        {command && <span className="command text-app-foreground">{command}</span>}
        {showCursor && <span className="cursor" />}
      </div>
      {children && (
        <div
          className={clsx(
            "space-y-3 text-xs leading-relaxed text-app-soft sm:text-sm",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
