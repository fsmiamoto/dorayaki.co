"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import ThemeToggle from "@/components/ThemeToggle";
import TokyoClock from "@/components/TokyoClock";

const windows = [
  { href: "/", label: "home" },
  { href: "/posts", label: "posts" },
  { href: "/about", label: "about" },
  { href: "/reading", label: "reading" },
];

export default function TerminalNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-40 flex h-9 items-center gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b border-app-border-subtle bg-app-surface px-2 text-[13px] [scrollbar-width:none] sm:px-3"
    >
      <Link
        href="/"
        aria-label="dorayaki"
        className="group mr-2.5 flex shrink-0 items-center gap-2 font-bold text-app-foreground hover:text-app-accent"
      >
        <span className="relative h-[18px] w-5 shrink-0">
          <Image
            src="/icons/dorayaki-normal.webp"
            alt=""
            width={20}
            height={18}
            className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
          />
          <Image
            src="/icons/dorayaki-green.webp"
            alt=""
            width={20}
            height={18}
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </span>
        <span className="hidden sm:inline">[dorayaki]</span>
      </Link>
      {windows.map(({ href, label }, index) => {
        const active = isActive(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex h-full shrink-0 items-center border-b-2 px-[7px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-app-accent sm:px-2.5",
              active
                ? "border-app-accent text-app-foreground"
                : "border-transparent text-app-muted hover:text-app-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "mr-px max-[419px]:hidden",
                active ? "text-app-accent" : "text-app-faint",
              )}
            >
              {index}:
            </span>
            {label}
            {active && <span aria-hidden="true">*</span>}
          </Link>
        );
      })}
      <div className="ml-auto flex shrink-0 items-center gap-3.5 pl-2 text-app-muted">
        <TokyoClock className="hidden sm:inline" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
