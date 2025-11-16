'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import PostList from '@/components/PostList'
import type { Post } from '@/lib/posts'

interface PostsResultsProps {
  posts: Post[]
}

export default function PostsResults({ posts }: PostsResultsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const rawQuery = (searchParams.get('q') ?? '').trim()
  const normalizedQuery = rawQuery.toLowerCase()
  const normalizedTag = (searchParams.get('tag') ?? '').trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = normalizedTag
        ? post.frontMatter.tags?.some((candidate) => candidate.toLowerCase() === normalizedTag)
        : true

      const matchesQuery = normalizedQuery
        ? [
            post.frontMatter.title,
            post.frontMatter.excerpt,
            post.frontMatter.tags?.join(' '),
          ]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(normalizedQuery))
        : true

      return matchesTag && matchesQuery
    })
  }, [posts, normalizedQuery, normalizedTag])

  const totalCount = posts.length
  const filteredCount = filteredPosts.length

  const summaryParts = []
  if (rawQuery) {
    summaryParts.push(`query "${rawQuery}"`)
  }

  if (normalizedTag) {
    summaryParts.push(`#${normalizedTag}`)
  }

  const activeSummary =
    summaryParts.length > 0 ? `Filtered by ${summaryParts.join(' + ')}` : 'Showing all posts'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.72rem] uppercase tracking-[0.35em] text-app-muted">
        <span>{activeSummary}</span>
        <span>
          {filteredCount}/{totalCount} posts
        </span>
      </div>
      <PostList
        posts={filteredPosts}
        tagLinkOptions={{
          basePath: pathname,
          preservedQuery: rawQuery ? { q: rawQuery } : undefined,
        }}
        activeTag={normalizedTag}
        emptyState="No posts match your filters."
      />
    </div>
  )
}
