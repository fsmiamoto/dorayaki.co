import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import BackNavigation from '@/components/BackNavigation'
import PostsResults from '@/components/PostsResults'
import OpinionDisclaimer from '@/components/OpinionDisclaimer'

export const metadata: Metadata = {
  title: 'Posts - dorayaki',
  description: 'Browse notes and long-form thoughts by Flavio Miyamoto.',
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>
      <TerminalWindow title="posts/">
        <div className="space-y-8">
          <CommandPrompt command="cat DISCLAIMER.txt" showCursor={false}>
            <OpinionDisclaimer />
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
