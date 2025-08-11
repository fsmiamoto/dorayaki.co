import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import { MDXContent } from '@/lib/mdx'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.frontMatter.title} - dorayaki`,
    description: post.frontMatter.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.frontMatter.date,
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-terminal-amber hover:text-terminal-text transition-colors text-sm"
        >
          ← cd ~/
        </Link>
      </div>

      <TerminalWindow title={`posts/${post.slug}.md`}>
        <div className="space-y-8">
          <CommandPrompt 
            command={`cat posts/${post.slug}.md`} 
            showCursor={false}
          >
            <div className="space-y-4">
              <div className="border-b border-terminal-window-border pb-4">
                <h1 className="text-2xl font-bold text-terminal-prompt mb-2">
                  {post.frontMatter.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-terminal-gray">
                  <span>{post.formattedDate}</span>
                  <span>{post.readingTime}</span>
                  {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.frontMatter.tags.map(tag => (
                        <span key={tag} className="text-terminal-prompt">
                          #{tag.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <article className="prose prose-invert max-w-none">
                <MDXContent source={post.content} />
              </article>
            </div>
          </CommandPrompt>

          <CommandPrompt command="ls ../" showCursor={false}>
            <div className="flex gap-8 text-sm">
              <Link href="/" className="text-terminal-amber hover:text-terminal-text transition-colors">
                ../
              </Link>
              <span className="text-terminal-gray">- Back to home</span>
            </div>
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  )
}