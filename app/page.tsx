import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import PostList from '@/components/PostList'

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4"
  >
    <path
      fill="currentColor"
      d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 008.012 10.928c.585.11.8-.254.8-.566 0-.28-.01-1.022-.016-2.007-3.258.708-3.945-1.571-3.945-1.571-.531-1.35-1.296-1.71-1.296-1.71-1.06-.725.08-.711.08-.711 1.172.083 1.788 1.205 1.788 1.205 1.04 1.781 2.732 1.267 3.4.969.105-.753.407-1.267.74-1.558-2.6-.296-5.334-1.3-5.334-5.783 0-1.277.456-2.32 1.205-3.136-.121-.297-.523-1.494.114-3.115 0 0 .985-.315 3.23 1.197a11.26 11.26 0 015.88 0c2.244-1.512 3.228-1.197 3.228-1.197.639 1.621.237 2.818.116 3.115.75.816 1.203 1.859 1.203 3.136 0 4.495-2.738 5.484-5.346 5.775.418.36.79 1.07.79 2.156 0 1.557-.014 2.812-.014 3.193 0 .315.212.68.806.565A11.5 11.5 0 0023.5 12C23.5 5.648 18.352.5 12 .5z"
    />
  </svg>
)

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4"
  >
    <path
      fill="currentColor"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.851 0-2.135 1.445-2.135 2.939v5.667H9.354V9h3.413v1.561h.047c.476-.9 1.637-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.002-4.124 2.062 2.062 0 01-.002 4.124zM7.114 20.452H3.56V9h3.555v11.452z"
    />
  </svg>
)

export default function Home() {
  const posts = getAllPosts()
  const featuredPosts = posts.slice(0, 2)
  const hasMorePosts = posts.length > featuredPosts.length

  return (
    <TerminalWindow title="dorayaki.co">
      <div className="space-y-8">
        <div>
          <CommandPrompt command="whoami" contentClassName="space-y-6 text-sm leading-relaxed sm:text-base">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <span className="pointer-events-none absolute -inset-3 rounded-full bg-app-accent/10 blur-xl" />
                <Image
                  src="/avatar.png"
                  alt="Flavio Miyamoto"
                  width={128}
                  height={128}
                  className="relative rounded-full border border-app-border-subtle"
                  priority
                />
              </div>
              <div className="space-y-4 text-app-soft">
                <div className="space-y-1">
                  <h1 className="text-xl font-semibold text-app-foreground sm:text-2xl">
                    Flavio Miyamoto
                  </h1>
                  <p className="text-app-muted">ミヤモト・フラヴィオ</p>
                  <p>Software Development Engineer II @ Amazon</p>
                  <p>Born in 🇧🇷 and living in 🇯🇵</p>
                </div>
                <div>
                  <p className="text-app-foreground italic">Building things faster that I can break them</p>
                </div>
                <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.35em] text-app-muted">
                  <span className="rounded-full px-3 py-1 text-app-accent">builder</span>
                  <span className="rounded-full px-3 py-1 text-app-info">curious</span>
                  <span className="rounded-full px-3 py-1 text-app-amber">eternal learner</span>
                </div>
              </div>
            </div>

          </CommandPrompt>
        </div>

        <CommandPrompt command='cat socials' showCursor={false}>
          <div className="flex flex-wrap gap-3 text-xs tracking-[0.3em] sm:text-sm">
            <Link
              href="https://github.com/fsmiamoto"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-transparent px-4 py-2 text-purple-600 transition-all hover:border-purple-600 dark:text-purple-400 dark:hover:border-purple-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              [github]
            </Link>
            <Link
              href="https://www.linkedin.com/in/fsmiamoto/"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-transparent px-4 py-2 text-blue-600 transition-all hover:border-blue-600 dark:text-blue-400 dark:hover:border-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              [linkedin]
            </Link>
          </div>
        </CommandPrompt>
        <CommandPrompt command="ls -la posts/ | head -2" showCursor={false} contentClassName="space-y-4 text-xs sm:text-sm">
          <div className="space-y-4">
            <PostList
              posts={featuredPosts}
              tagLinkOptions={{ basePath: '/posts' }}
            />
            {hasMorePosts && (
              <div className="flex justify-end">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.35em] text-app-accent transition-colors hover:text-app-accent-strong"
                >
                  see all posts
                </Link>
              </div>
            )}
          </div>
        </CommandPrompt>

        <CommandPrompt
          command="help"
          showCursor={false}
          contentClassName="space-y-3 text-xs sm:text-sm"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-app-accent transition-colors hover:text-app-accent-strong"
              >
                cat about.md
              </Link>
              <p className="text-app-soft">
                Learn about me
              </p>
            </div>
            <div className="space-y-1">
              <Link
                href="/reading"
                className="inline-flex items-center gap-2 text-app-info transition-colors hover:text-app-accent"
              >
                cat reading.md
              </Link>
              <p className="text-app-soft">
                My (always changing) list of books that shape how I think
              </p>
            </div>
            <div className="space-y-1">
              <Link
                href="/cv.pdf"
                className="inline-flex items-center gap-2 text-app-amber transition-colors hover:text-app-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                curl resume.pdf
              </Link>
              <p className="text-app-soft">
                Download my resume
              </p>
            </div>
          </div>
        </CommandPrompt>
      </div>
    </TerminalWindow>
  )
}
