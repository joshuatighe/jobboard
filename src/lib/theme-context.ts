import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export type ThemeState = {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

export const THEME_STORAGE_KEY = 'jobboard-theme'

export const ThemeContext = createContext<ThemeState | null>(null)
