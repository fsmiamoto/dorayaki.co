'use client'

import Link from 'next/link'
import clsx from 'clsx'
import type { Post } from '@/lib/posts'

interface TagLinkOptions {
  basePath: string
  preservedQuery?: Record<string, string>
}

interface PostListProps {
  posts: Post[]
  emptyState?: string
  tagLinkOptions?: TagLinkOptions
  activeTag?: string
}

const tagPalette = ['text-app-accent', 'text-app-info', 'text-app-amber'] as const

export default function PostList({
  posts,
  emptyState = 'No posts found. Checking content/posts directory...',
  tagLinkOptions,
  activeTag,
}: PostListProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-app-muted">{emptyState}</div>
  }

  const buildTagHref = (tag: string) => {
    if (!tagLinkOptions) {
      return null
    }

    const params = new URLSearchParams(tagLinkOptions.preservedQuery ?? {})
    params.set('tag', tag.toLowerCase())

    const query = params.toString()
    return query ? `${tagLinkOptions.basePath}?${query}` : tagLinkOptions.basePath
  }

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      {posts.map((post) => (
        <article key={post.slug} className="group flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-app-muted">
            <span className="font-mono">{post.formattedDate}</span>
            <span className="font-mono text-app-amber">{post.readingTime}</span>
          </div>
          <Link
            href={`/posts/${post.slug}`}
            className="text-lg font-bold text-app-foreground transition-colors hover:text-app-accent sm:text-xl"
          >
            {post.frontMatter.title}
          </Link>
          {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              {post.frontMatter.tags.map((tag, index) => {
                const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-')
                const isActive = activeTag && activeTag.toLowerCase() === tag.toLowerCase()
                const className = clsx(
                  'transition-colors hover:underline',
                  isActive ? 'text-app-foreground font-bold' : 'text-app-muted hover:text-app-accent',
                )
                const tagHref = buildTagHref(tag)

                if (tagHref) {
                  return (
                    <Link key={`${post.slug}-${tag}`} href={tagHref} className={className}>
                      #{normalizedTag}
                    </Link>
                  )
                }

                return (
                  <span key={`${post.slug}-${tag}`} className={className}>
                    #{normalizedTag}
                  </span>
                )
              })}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
