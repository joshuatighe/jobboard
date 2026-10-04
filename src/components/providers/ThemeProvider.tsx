import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'

import { THEME_STORAGE_KEY, ThemeContext, type Theme } from '@/lib/theme-context'

const media = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Fall back to system.
  }
  return 'system'
}

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(media)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const systemPrefersDark = () => window.matchMedia(media).matches

/** Light / dark / system theme via a `.dark` class on <html>. index.html sets it before first paint. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const systemDark = useSyncExternalStore(subscribeToSystem, systemPrefersDark)
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore: the choice still applies for this session.
    }
  }, [])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
