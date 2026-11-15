import type { Metadata } from "next";
import { getAllPostSummaries } from "@/lib/posts";
import CommandPrompt from "@/components/CommandPrompt";
import PostList from "@/components/PostList";
import OpinionDisclaimer from "@/components/OpinionDisclaimer";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Posts - dorayaki",
  description: "Posts on software engineering, AI, and more",
  alternates: {
    canonical: withTrailingSlash("/posts"),
  },
  openGraph: {
    title: "Posts - dorayaki",
    description: "Posts on software engineering, AI, and more",
    url: absoluteUrl(withTrailingSlash("/posts")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts - dorayaki",
    description: "Posts on software engineering, AI, and more",
  },
};

export default function PostsPage() {
  const posts = getAllPostSummaries();

  return (
    <CommandPrompt command="ls -lt posts/" showCursor={false}>
      <header className="mb-7 space-y-2">
        <h1 className="text-[22px] font-bold leading-tight tracking-tight sm:text-[28px]">Posts</h1>
        <OpinionDisclaimer />
      </header>
      <PostList posts={posts} groupByYear />
    </CommandPrompt>
  );
}
