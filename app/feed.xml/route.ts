import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, toPlainTextExcerpt } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822Date(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

export function GET(): Response {
  const posts = getAllPosts();
  const siteUrl = absoluteUrl("/");
  const feedUrl = absoluteUrl("/feed.xml");

  const itemsXml = posts
    .map((post) => {
      const postUrl = absoluteUrl(`/posts/${post.slug}/`);
      const description = post.frontMatter.excerpt || toPlainTextExcerpt(post.content, 300);

      return `    <item>
      <title>${escapeXml(post.frontMatter.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRfc822Date(post.frontMatter.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>dorayaki</title>
    <link>${siteUrl}</link>
    <description>Personal blog</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
