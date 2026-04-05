import Link from "next/link";
import Image from "next/image";

export default function TerminalNav() {
  return (
    <nav className="mb-6 border-b border-app-border-subtle pb-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-app-muted sm:text-sm">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-app-foreground transition-colors duration-150 hover:text-app-accent">
          <Image src="/favicon_32.png" alt="" width={18} height={18} className="shrink-0" />
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
        <Link
          href="/cv.pdf"
          className="link-nav text-app-amber"
          target="_blank"
          rel="noopener noreferrer"
        >
          resume.pdf
        </Link>
      </div>
    </nav>
  );
}
