import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <TerminalWindow title="bash">
        <div className="space-y-6">
          <CommandPrompt command="cat page.md" showCursor={false}>
            <div className="space-y-3">
              <p className="font-semibold text-app-danger">
                cat: page.md: No such file or directory
              </p>
              <p className="text-sm text-app-muted">
                The file you requested doesn&apos;t exist in this directory.
              </p>
            </div>
          </CommandPrompt>

          <CommandPrompt command="ls -la" showCursor={false}>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="text-app-info">drwxr-xr-x</span>
                <Link href="/" className="link-nav-underline">
                  ./
                </Link>
              </div>
              <div className="flex gap-4">
                <span className="text-app-info">drwxr-xr-x</span>
                <Link href="/posts" className="link-nav-underline text-app-purple">
                  posts/
                </Link>
              </div>
              <div className="flex gap-4">
                <span className="text-app-info">-rw-r--r--</span>
                <Link href="/about" className="link-nav-underline">
                  about.md
                </Link>
              </div>
              <div className="flex gap-4">
                <span className="text-app-info">-rw-r--r--</span>
                <Link href="/reading" className="link-nav-underline text-app-info">
                  reading.md
                </Link>
              </div>
            </div>
          </CommandPrompt>

          <CommandPrompt command="cd ~/" showCursor={true}>
            <Link href="/" className="link-nav text-sm">
              Back to home
            </Link>
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  );
}
