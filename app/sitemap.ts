import fs from 'fs'
import path from 'path'
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { absoluteUrl, withTrailingSlash } from '@/lib/seo'

export const dynamic = 'force-static'

function getStaticLastModified(): string {
  try {
    const siteJsonPath = path.join(process.cwd(), 'content', 'site.json')
    const json = JSON.parse(fs.readFileSync(siteJsonPath, 'utf8')) as { lastUpdated?: string }
    if (json.lastUpdated) {
      return new Date(json.lastUpdated).toISOString()
    }
  } catch {
    // ignore
  }
  return new Date('2026-01-01').toISOString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticLastModified = getStaticLastModified()

  const postUrls = posts.map((post) => ({
    url: absoluteUrl(withTrailingSlash(`/posts/${post.slug}`)),
    lastModified: post.frontMatter.date,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: absoluteUrl('/'),
      lastModified: staticLastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: absoluteUrl(withTrailingSlash('/about')),
      lastModified: staticLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl(withTrailingSlash('/reading')),
      lastModified: staticLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl(withTrailingSlash('/posts')),
      lastModified: staticLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]

  return [...staticUrls, ...postUrls]
}
