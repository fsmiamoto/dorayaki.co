import Link from "next/link";
import type { Post } from "@/lib/posts";

interface PostListProps {
  posts: Post[];
  emptyState?: string;
}

function PostItem({ post }: { post: Post }) {
  return (
    <article
      key={post.slug}
      className="group -mx-3 flex flex-col gap-2 rounded-md border-l-2 border-transparent py-2 pl-3 pr-3 transition-all duration-200 hover:translate-x-0.5 hover:border-app-accent"
    >
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
  );
}

export default function PostList({ posts, emptyState = "No posts found." }: PostListProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-app-muted">{emptyState}</div>;
  }

  const postsByYear: Record<string, Post[]> = {};
  for (const post of posts) {
    const year = new Date(post.frontMatter.date).getFullYear().toString();
    if (!postsByYear[year]) postsByYear[year] = [];
    postsByYear[year].push(post);
  }
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      {years.map((year) => (
        <div key={year}>
          <div className="flex items-center gap-3 text-xs text-app-faint">
            <span className="font-semibold tracking-[0.3em]">{year}</span>
            <span className="flex-1 border-t border-app-border-subtle" />
          </div>
          {postsByYear[year].map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      ))}
    </div>
  );
}
