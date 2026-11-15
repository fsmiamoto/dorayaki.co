import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { format } from "date-fns";
import { toPlainTextExcerpt } from "@/lib/seo";

export interface PostFrontMatter {
  title: string;
  date: string;
  tags?: string[];
  categories?: string[];
  excerpt?: string;
}

export interface Post {
  slug: string;
  frontMatter: PostFrontMatter;
  content: string;
  excerpt: string;
  readingTime: string;
  date: string;
  formattedDate: string;
}

export type PostSummary = Omit<Post, "content">;

const EXCERPT_MAX_LENGTH = 150;

function firstParagraphExcerpt(content: string): string {
  const paragraph = content
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 40 && !/^(#|!|>|\||<|[-*+] |\d+\. )/.test(block));

  if (!paragraph) {
    return "";
  }

  const text = toPlainTextExcerpt(paragraph, Number.MAX_SAFE_INTEGER);
  if (text.length <= EXCERPT_MAX_LENGTH) {
    return text;
  }

  let excerpt = "";
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (excerpt && excerpt.length + sentence.length + 1 > EXCERPT_MAX_LENGTH) {
      break;
    }
    excerpt = excerpt ? `${excerpt} ${sentence}` : sentence;
  }

  return excerpt.length <= EXCERPT_MAX_LENGTH + 15
    ? excerpt
    : `${toPlainTextExcerpt(excerpt, EXCERPT_MAX_LENGTH).replace(/[,;:]$/, "")}…`;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const slugs = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx?$/, ""));
  return slugs;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const frontMatter = data as PostFrontMatter;
    const readingStats = readingTime(content);

    return {
      slug,
      frontMatter,
      content,
      excerpt: frontMatter.excerpt ?? firstParagraphExcerpt(content),
      readingTime: readingStats.text,
      date: format(new Date(frontMatter.date), "yyyy-MM-dd"),
      formattedDate: format(new Date(frontMatter.date), "MMM dd, yyyy"),
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();

  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      return post;
    })
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime(),
    );

  return posts;
}

export function getAllPostSummaries(): PostSummary[] {
  return getAllPosts().map((post) => {
    const summary: PostSummary & { content?: string } = { ...post };
    delete summary.content;
    return summary;
  });
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.frontMatter.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
