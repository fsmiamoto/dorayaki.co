'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'

interface PostsFilterControlsProps {
  tags: string[]
}

const formatTagSlug = (tag: string) => `#${tag.toLowerCase().replace(/\s+/g, '-')}`

export default function PostsFilterControls({ tags }: PostsFilterControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentQuery = searchParams.get('q') ?? ''
  const currentTag = (searchParams.get('tag') ?? '').toLowerCase()
  const [searchValue, setSearchValue] = useState(currentQuery)

  useEffect(() => {
    setSearchValue(currentQuery)
  }, [currentQuery])

  const buildHref = useCallback(
    (overrides: { q?: string; tag?: string }) => {
      const params = new URLSearchParams()
      const nextQuery = overrides.q ?? currentQuery
      const nextTag = (overrides.tag ?? currentTag).toLowerCase()

      if (nextQuery.trim()) {
        params.set('q', nextQuery.trim())
      }

      if (nextTag) {
        params.set('tag', nextTag)
      }

      const queryString = params.toString()
      return queryString ? `${pathname}?${queryString}` : pathname
    },
    [currentQuery, currentTag, pathname],
  )

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(buildHref({ q: searchValue }))
  }

  const handleReset = () => {
    setSearchValue('')
    router.push(pathname)
  }

  const handleTagSelect = (tag?: string) => {
    router.push(
      buildHref({
        q: currentQuery,
        tag: tag ? tag.toLowerCase() : '',
      }),
    )
  }

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="search">
          Search posts
        </label>
        <input
          id="search"
          name="q"
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search posts by title"
          className="flex-1 rounded border border-app-border-subtle bg-app-background/70 px-3 py-2 text-sm text-app-foreground outline-none transition focus:border-app-accent"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded border border-app-border-subtle px-3 py-2 text-[0.72rem] uppercase tracking-[0.3em] text-app-foreground transition hover:border-app-accent hover:text-app-accent"
          >
            search
          </button>
          {(currentQuery || currentTag) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[0.72rem] uppercase tracking-[0.3em] text-app-muted transition-colors hover:text-app-foreground"
            >
              reset
            </button>
          )}
        </div>
      </form>

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.4em] text-app-muted">tags</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTagSelect(undefined)}
              className={clsx(
                'inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition-colors',
                !currentTag
                  ? 'border-app-accent text-app-accent'
                  : 'border-transparent bg-app-border-subtle/30 text-app-muted hover:text-app-foreground',
              )}
            >
              all
            </button>
            {tags.map((tagOption) => {
              const normalizedOption = tagOption.toLowerCase()
              const isActive = normalizedOption === currentTag

              return (
                <button
                  type="button"
                  key={tagOption}
                  onClick={() => handleTagSelect(tagOption)}
                  className={clsx(
                    'inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition-colors',
                    isActive
                      ? 'border-app-accent text-app-accent'
                      : 'border-transparent bg-app-border-subtle/30 text-app-soft hover:text-app-foreground',
                  )}
                >
                  {formatTagSlug(tagOption)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
