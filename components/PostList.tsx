import Link from "next/link";
import type { Post } from "@/lib/posts";

interface PostListProps {
  posts: Post[];
  emptyState?: string;
}

export default function PostList({ posts, emptyState = "No posts found." }: PostListProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-app-muted">{emptyState}</div>;
  }

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      {posts.map((post) => (
        <article key={post.slug} className="group -mx-3 flex flex-col gap-2 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-app-surface-muted/50">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-app-muted">
            <span className="font-mono">{post.formattedDate}</span>
            <span className="font-mono text-app-amber">{post.readingTime}</span>
          </div>
          <Link href={`/posts/${post.slug}`} className="link-content text-lg font-bold sm:text-xl">
            {post.frontMatter.title}
          </Link>
          {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              {post.frontMatter.tags.map((tag) => {
                const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
                return (
                  <span key={`${post.slug}-${tag}`} className="text-app-muted">
                    #{normalizedTag}
                  </span>
                );
              })}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
