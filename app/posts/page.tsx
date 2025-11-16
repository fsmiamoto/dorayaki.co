import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import PostsFilterControls from '@/components/PostsFilterControls'
import PostsResults from '@/components/PostsResults'
import BackNavigation from '@/components/BackNavigation'

export const metadata: Metadata = {
  title: 'Posts - dorayaki',
  description: 'Browse notes and long-form thoughts by Flavio Miyamoto.',
}

export default function PostsPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>
      <TerminalWindow title="posts/">
        <div className="space-y-8">
          <CommandPrompt command="cat filters.txt" showCursor={false}>
            <Suspense fallback={<div className="text-xs text-app-muted">Loading filters...</div>}>
              <PostsFilterControls tags={tags} />
            </Suspense>
          </CommandPrompt>

          <CommandPrompt
            command="ls -la posts/"
            showCursor={false}
            contentClassName="space-y-4 text-xs sm:text-sm"
          >
            <Suspense fallback={<div className="text-xs text-app-muted">Loading posts...</div>}>
              <PostsResults posts={posts} />
            </Suspense>
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  )
}
