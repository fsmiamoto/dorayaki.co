export const SITE_ORIGIN = 'https://dorayaki.co' as const

export function withTrailingSlash(pathname: string): string {
  const normalized = pathname.trim()

  if (normalized === '' || normalized === '/') {
    return '/'
  }

  const leadingSlash = `/${normalized.replace(/^\/+/, '')}`
  return leadingSlash.endsWith('/') ? leadingSlash : `${leadingSlash}/`
}

export function absoluteUrl(pathname: string): string {
  const path = pathname.trim()
  if (path === '') {
    return `${SITE_ORIGIN}/`
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  const collapsed = normalized.replace(/^\/+/, '/')
  return `${SITE_ORIGIN}${collapsed}`
}

export function toPlainTextExcerpt(input: string, maxLen = 160): string {
  const withoutFrontmatter = input.replace(/^---[\s\S]*?---\s*/m, '')

  const withoutFences = withoutFrontmatter.replace(/```[\s\S]*?```/g, ' ')
  const withoutInlineCode = withoutFences.replace(/`([^`]+)`/g, '$1')
  const withoutImages = withoutInlineCode.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  const withoutLinks = withoutImages.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  const withoutMarkdown = withoutLinks
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~]+/g, '')

  const collapsedWhitespace = withoutMarkdown.replace(/\s+/g, ' ').trim()
  if (collapsedWhitespace.length <= maxLen) {
    return collapsedWhitespace
  }

  const chars = Array.from(collapsedWhitespace)
  const clipped = chars.slice(0, maxLen).join('')
  const lastSpace = clipped.lastIndexOf(' ')
  return (lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trim()
}
