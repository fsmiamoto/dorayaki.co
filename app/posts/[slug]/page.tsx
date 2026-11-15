import { getAllPostSlugs, getAllPostSummaries, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/lib/mdx";
import CommandPrompt from "@/components/CommandPrompt";
import OpinionDisclaimer from "@/components/OpinionDisclaimer";
import Comments from "@/components/Comments";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, toPlainTextExcerpt, withTrailingSlash } from "@/lib/seo";
import { extractPostHeadings } from "@/lib/post-headings";
import PostOutline from "@/components/PostOutline";

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
  const headings = extractPostHeadings(post.content);
  const showOutline = headings.length >= 2;
  const summaries = getAllPostSummaries();
  const olderPost = summaries[summaries.findIndex(({ slug }) => slug === post.slug) + 1];

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
    <div>
      <JsonLd data={jsonLd} />
      <CommandPrompt directory="~/posts" command={`cat ${post.slug}.md`} showCursor={false} />
      <div
        className={clsx(
          showOutline &&
            "lg:grid lg:grid-cols-[minmax(0,68ch)_200px] lg:items-start lg:justify-between lg:gap-12",
        )}
      >
        <div className="min-w-0 max-w-[68ch]">
          <header className="mb-6 border-b border-app-border-subtle pb-5">
            <h1 className="text-[23px] font-bold leading-tight tracking-tight text-app-foreground sm:text-[30px]">
              {post.frontMatter.title}
            </h1>
            {post.frontMatter.excerpt && (
              <p className="mt-3 text-[15px] text-app-soft">{post.frontMatter.excerpt}</p>
            )}
            <div className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] text-app-muted">
              <time dateTime={post.date}>{post.date}</time>
              <span className="text-app-amber">{post.readingTime}</span>
              {post.frontMatter.tags?.map((tag) => (
                <span key={tag} className="text-app-faint">
                  #{tag.toLowerCase().replace(/\s+/g, "-")}
                </span>
              ))}
            </div>
          </header>

          <OpinionDisclaimer className="mb-6" />

          {showOutline && <PostOutline headings={headings} variant="mobile" />}

          <article className="prose-terminal prose-img:rounded-md prose-img:border prose-img:border-app-border-subtle">
            <MDXContent source={post.content} headings={headings} />
          </article>

          <nav
            aria-label="Posts"
            className="mt-11 flex justify-between gap-6 border-t border-app-border-subtle pt-5 text-[13px]"
          >
            <Link href="/posts" className="group text-app-muted hover:text-app-accent">
              ← cd ..
              <span className="block text-sm font-bold text-app-foreground group-hover:text-app-accent">
                All posts
              </span>
            </Link>
            {olderPost && (
              <Link
                href={`/posts/${olderPost.slug}`}
                className="group text-right text-app-muted hover:text-app-accent"
              >
                next →
                <span className="block text-sm font-bold text-app-foreground group-hover:text-app-accent">
                  {olderPost.frontMatter.title}
                </span>
              </Link>
            )}
          </nav>

          <div className="pt-10">
            <Comments slug={post.slug} />
          </div>
        </div>

        {showOutline && <PostOutline headings={headings} variant="desktop" />}
      </div>
    </div>
  );
}
