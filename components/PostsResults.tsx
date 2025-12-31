import PostList from '@/components/PostList'
import type { Post } from '@/lib/posts'

interface PostsResultsProps {
  posts: Post[]
}

export default function PostsResults({ posts }: PostsResultsProps) {
  return <PostList posts={posts} />
}
