import Link from "next/link";

export default function TerminalNav() {
  return (
    <nav className="mt-6 border-t border-app-border-subtle pt-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-app-muted sm:text-sm">
        <span className="text-app-faint">~/</span>
        <Link href="/" className="link-nav">
          home
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
