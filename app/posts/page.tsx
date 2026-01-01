import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import BackNavigation from "@/components/BackNavigation";
import PostsResults from "@/components/PostsResults";
import OpinionDisclaimer from "@/components/OpinionDisclaimer";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Posts - dorayaki",
  description: "My (not go great) writing",
  alternates: {
    canonical: withTrailingSlash("/posts"),
  },
  openGraph: {
    title: "Posts - dorayaki",
    description: "My (not go great) writing",
    url: absoluteUrl(withTrailingSlash("/posts")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts - dorayaki",
    description: "My (not go great) writing",
  },
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>
      <TerminalWindow title="posts/">
        <div className="space-y-8">
          <h1 className="text-2xl font-semibold text-app-foreground sm:text-3xl">Posts</h1>
          <CommandPrompt command="cat DISCLAIMER.txt" showCursor={false}>
            <OpinionDisclaimer />
          </CommandPrompt>

          <CommandPrompt
            command="ls -la posts/"
            showCursor={false}
            contentClassName="space-y-4 text-xs sm:text-sm"
          >
            <PostsResults posts={posts} />
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  );
}
