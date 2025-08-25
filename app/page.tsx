import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import ASCIIHeader from '@/components/ASCIIHeader'

export default function Home() {
  const posts = getAllPosts()
  console.log('Posts found:', posts.length, posts.map(p => p.slug))

  return (
    <TerminalWindow title="dorayaki.co">
      <div className="space-y-8">
        <div>
          <ASCIIHeader text="DORAYAKI" />

          <CommandPrompt command="whoami">
            <div className="space-y-2">
              <div className="text-terminal-amber">Flavio Miyamoto</div>
              <div className="text-terminal-amber">ミヤモト・フラヴィオ</div>
              <div className="text-terminal-amber">Software Development Engineer II at Amazon</div>
              <div className="text-terminal-white">Tokyo, Japan</div>
              <div className="text-terminal-white">Writing terrible code for a living</div>
            </div>
          </CommandPrompt>

          <div className="flex gap-2 sm:gap-4 text-sm mt-4 flex-wrap">
            <Link
              href="https://github.com/fsmiamoto"
              className="text-terminal-amber hover:text-terminal-text transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              [github]
            </Link>
            <Link
              href="https://www.linkedin.com/in/fsmiamoto/"
              className="text-terminal-amber hover:text-terminal-text transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              [linkedin]
            </Link>
          </div>
        </div>

        <CommandPrompt command="ls -la posts/" showCursor={false}>
          <div className="space-y-2 font-mono text-xs sm:text-sm">
            <div className="text-terminal-gray">
              total {posts.length}
            </div>
            {posts.length === 0 ? (
              <div className="text-terminal-gray">No posts found. Checking content/posts directory...</div>
            ) : (
              posts.map((post, index) => (
                <div key={post.slug} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-terminal-white w-8 flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-terminal-white w-20 sm:w-24 flex-shrink-0">
                      {post.formattedDate}
                    </span>
                    <span className="text-terminal-white w-12 sm:w-16 flex-shrink-0">
                      {post.readingTime}
                    </span>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-terminal-text hover:text-terminal-amber transition-colors flex-1 min-w-0 break-words"
                  >
                    {post.frontMatter.title}
                  </Link>
                  {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      {post.frontMatter.tags.map(tag => (
                        <span key={tag} className="text-terminal-prompt text-xs">
                          #{tag.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CommandPrompt>

        <CommandPrompt command="help" showCursor={false}>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
              <Link href="/about" className="text-terminal-amber hover:text-terminal-text transition-colors">
                cat about.md
              </Link>
              <span className="text-terminal-white">- Learn about me</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
              <Link href="/reading" className="text-terminal-amber hover:text-terminal-text transition-colors">
                cat reading.md
              </Link>
              <span className="text-terminal-white">- My reading list</span>
            </div>
          </div>
        </CommandPrompt>
      </div>
    </TerminalWindow>
  )
}
