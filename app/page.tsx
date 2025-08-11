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
              <div className="text-terminal-gray">Tokyo, Japan</div>
              <div className="text-terminal-gray">Writing terrible code for a living</div>
            </div>
          </CommandPrompt>

          <div className="flex gap-4 text-sm mt-4">
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
          <div className="space-y-2 font-mono text-sm">
            <div className="text-terminal-gray">
              total {posts.length}
            </div>
            {posts.length === 0 ? (
              <div className="text-terminal-gray">No posts found. Checking content/posts directory...</div>
            ) : (
              posts.map((post, index) => (
                <div key={post.slug} className="flex items-center gap-4">
                  <span className="text-terminal-gray w-8">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-terminal-gray w-24">
                    {post.formattedDate}
                  </span>
                  <span className="text-terminal-gray w-16">
                    {post.readingTime}
                  </span>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-terminal-text hover:text-terminal-amber transition-colors flex-1"
                  >
                    {post.frontMatter.title}
                  </Link>
                  {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                    <div className="flex gap-2">
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
          <div className="space-y-2 text-sm">
            <div className="flex gap-8">
              <Link href="/about" className="text-terminal-amber hover:text-terminal-text transition-colors">
                cat about.md
              </Link>
              <span className="text-terminal-gray">- Learn about me</span>
            </div>
            <div className="flex gap-8">
              <Link href="/reading" className="text-terminal-amber hover:text-terminal-text transition-colors">
                cat reading.md
              </Link>
              <span className="text-terminal-gray">- My reading list</span>
            </div>
          </div>
        </CommandPrompt>
      </div>
    </TerminalWindow>
  )
}
