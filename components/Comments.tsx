'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useTheme } from '@/components/ThemeProvider'

const DEFAULT_CONFIG = {
  repo: 'fsmiamoto/dorayaki.co',
  repoId: 'R_kgDONzGtjQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDONzGtjc4C0bPi',
  mapping: 'pathname',
  strict: '1',
  reactionsEnabled: '0',
  emitMetadata: '1',
  inputPosition: 'bottom',
  lang: 'en',
} as const

interface CommentsProps {
  slug: string
  className?: string
}

export default function Comments({ slug, className }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const {
      repo,
      repoId,
      category,
      categoryId,
      mapping,
      strict,
      reactionsEnabled,
      emitMetadata,
      inputPosition,
      lang,
    } = DEFAULT_CONFIG
    const activeTheme = theme

    if (!repo || !repoId || !category || !categoryId) return

    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', mapping)
    script.setAttribute('data-strict', strict)
    script.setAttribute('data-reactions-enabled', reactionsEnabled)
    script.setAttribute('data-emit-metadata', emitMetadata)
    script.setAttribute('data-input-position', inputPosition)
    script.setAttribute('data-theme', activeTheme)
    script.setAttribute('data-lang', lang)

    containerRef.current.appendChild(script)
  }, [slug, theme])

  return <div ref={containerRef} className={clsx('giscus', className)} />
}
