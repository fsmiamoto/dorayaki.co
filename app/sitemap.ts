import { getAllPosts } from '@/lib/posts'

export default function sitemap() {
  const posts = getAllPosts()
  
  const postUrls = posts.map((post) => ({
    url: `https://dorayaki.co/posts/${post.slug}`,
    lastModified: post.frontMatter.date,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: 'https://dorayaki.co',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://dorayaki.co/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://dorayaki.co/reading',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...postUrls]
}