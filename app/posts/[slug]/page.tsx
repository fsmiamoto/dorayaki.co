import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/lib/mdx";
import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import BackNavigation from "@/components/BackNavigation";
import OpinionDisclaimer from "@/components/OpinionDisclaimer";
import Comments from "@/components/Comments";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, toPlainTextExcerpt, withTrailingSlash } from "@/lib/seo";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    } satisfies Metadata;
  }

  const canonicalPath = withTrailingSlash(`/posts/${slug}`);
  const url = absoluteUrl(canonicalPath);
  const description = toPlainTextExcerpt(post.frontMatter.excerpt ?? post.content);
  const publishedTime = new Date(post.frontMatter.date).toISOString();

  return {
    title: `${post.frontMatter.title} - dorayaki`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.frontMatter.title,
      description,
      url,
      type: "article",
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontMatter.title,
      description,
    },
    keywords: post.frontMatter.tags,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalPath = withTrailingSlash(`/posts/${post.slug}`);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const description = toPlainTextExcerpt(post.frontMatter.excerpt ?? post.content);
  const publishedTime = new Date(post.frontMatter.date).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontMatter.title,
    description,
    datePublished: publishedTime,
    author: {
      "@type": "Person",
      name: "Flavio Miyamoto",
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    keywords: post.frontMatter.tags,
  } as const;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>

      <TerminalWindow title={`posts/${post.slug}.md`}>
        <div className="space-y-8">
          <JsonLd data={jsonLd} />
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
                <span className="font-semibold text-app-amber">{post.readingTime}</span>
                {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.frontMatter.tags.map((tag, index) => {
                      const palette = ["text-app-info", "text-app-accent", "text-app-amber"];
                      return (
                        <span
                          key={tag}
                          className={clsx(
                            "inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em]",
                            palette[index % palette.length],
                          )}
                        >
                          #{tag.toLowerCase().replace(/\s+/g, "-")}
                        </span>
                      );
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

          <div className="pt-6">
            <Comments slug={post.slug} />
          </div>

          <CommandPrompt command="ls ../" showCursor={false}>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/posts" className="link-nav-underline">
                ../
              </Link>
              <span className="text-app-soft">Back to posts</span>
            </div>
          </CommandPrompt>
        </div>
      </TerminalWindow>
    </div>
  );
}
