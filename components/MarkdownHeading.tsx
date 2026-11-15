import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface MarkdownHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 2 | 3;
}

export default function MarkdownHeading({
  level = 2,
  className,
  children,
  ...props
}: MarkdownHeadingProps) {
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <Tag
      className={clsx(
        "font-bold tracking-tight text-app-foreground",
        level === 2 ? "text-[17px]" : "text-base",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-app-accent">
        {"#".repeat(level)}{" "}
      </span>
      {children}
    </Tag>
  );
}
