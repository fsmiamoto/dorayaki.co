import Link from "next/link";
import Image from "next/image";

export default function TerminalNav() {
  return (
    <nav className="mb-6 border-b border-app-border-subtle pb-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-app-muted sm:text-sm">
        <Link
          href="/"
          className="group flex items-center gap-1.5 font-bold text-app-foreground transition-colors duration-150 hover:text-app-accent"
        >
          <span className="relative shrink-0" style={{ width: 28, height: 26 }}>
            <Image
              src="/icons/dorayaki-normal.webp"
              alt=""
              width={28}
              height={26}
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
            />
            <Image
              src="/icons/dorayaki-green.webp"
              alt=""
              width={28}
              height={26}
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </span>
          dorayaki
        </Link>
        <Link href="/posts" className="link-nav text-app-purple">
          posts/
        </Link>
        <Link href="/about" className="link-nav">
          about.md
        </Link>
        <Link href="/reading" className="link-nav text-app-info">
          reading.md
        </Link>
      </div>
    </nav>
  );
}
