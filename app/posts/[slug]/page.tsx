import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import { MDXContent } from '@/lib/mdx'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import BackNavigation from '@/components/BackNavigation'
import OpinionDisclaimer from '@/components/OpinionDisclaimer'
import Link from 'next/link'
import clsx from 'clsx'
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
        <BackNavigation />
      </div>

      <TerminalWindow title={`posts/${post.slug}.md`}>
        <div className="space-y-8">
          <CommandPrompt
            command={`cat posts/${post.slug}.md`}
            showCursor={false}
            contentClassName="space-y-6 text-sm leading-relaxed sm:text-base"
          >
            <header className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-app-foreground sm:text-3xl">
                  {post.frontMatter.title}
                </h1>
                {post.frontMatter.excerpt && (
                  <p className="text-app-soft">{post.frontMatter.excerpt}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-app-muted sm:text-sm">
                <span className="text-app-accent">{post.formattedDate}</span>
                <span className="text-app-amber font-semibold">{post.readingTime}</span>
                {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.frontMatter.tags.map((tag, index) => {
                      const palette = ['text-app-info', 'text-app-accent', 'text-app-amber']
                      return (
                        <span
                          key={tag}
                          className={clsx(
                            'inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em]',
                            palette[index % palette.length],
                          )}
                        >
                          #{tag.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </header>

            <OpinionDisclaimer className="text-app-muted" />

            <article className="prose-terminal">
              <MDXContent source={post.content} />
            </article>
          </CommandPrompt>

          <CommandPrompt command="ls ../" showCursor={false}>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/posts"
                className="link-nav-underline"
              >
                ../
              </Link>
              <span className="text-app-soft">Back to posts</span>
            </div>
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  )
}
