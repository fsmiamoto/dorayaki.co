'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'

type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  ready: boolean
}

const STORAGE_KEY = 'dorayaki-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: ReactNode
  defaultTheme?: ThemeMode
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme)
  const [ready, setReady] = useState(false)

  const applyTheme = useCallback((mode: ThemeMode) => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = mode
  }, [])

  const persistTheme = useCallback((mode: ThemeMode) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [])

  const setThemeInternal = useCallback(
    (mode: ThemeMode, options: { persist?: boolean } = {}) => {
      const { persist = true } = options
      setThemeState(mode)
      applyTheme(mode)
      if (persist) {
        persistTheme(mode)
      }
    },
    [applyTheme, persistTheme],
  )

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeInternal(mode)
    },
    [setThemeInternal],
  )

  const toggleTheme = useCallback(() => {
    setThemeInternal(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setThemeInternal])

  useEffect(() => {
    const storedPreference =
      typeof window !== 'undefined'
        ? (window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null)
        : null

    const systemPreference: ThemeMode =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'

    const initialTheme = storedPreference ?? systemPreference ?? defaultTheme
    setThemeInternal(initialTheme, { persist: Boolean(storedPreference) })
    setReady(true)
  }, [defaultTheme, setThemeInternal])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      ready,
    }),
    [theme, toggleTheme, setTheme, ready],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
