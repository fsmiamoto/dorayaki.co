import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { format } from "date-fns";

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
  readingTime: string;
  formattedDate: string;
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
      readingTime: readingStats.text,
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
