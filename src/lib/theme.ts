import { useEffect, useState } from 'react'
import type { ResolvedTheme } from '../types'

function canUseBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function getColorSchemeMediaQuery() {
  if (!canUseBrowser() || typeof window.matchMedia !== 'function') {
    return null
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    return null
  }
}

function getSystemDarkPreference() {
  return getColorSchemeMediaQuery()?.matches ?? false
}

export function resolveTheme(systemPrefersDark: boolean): ResolvedTheme {
  return systemPrefersDark ? 'dark' : 'light'
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  if (!canUseBrowser()) {
    return
  }

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

export function useThemePreference() {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getSystemDarkPreference())
  )

  useEffect(() => {
    const mediaQuery = getColorSchemeMediaQuery()

    if (!mediaQuery) {
      return undefined
    }

    function handleChange(event: MediaQueryListEvent) {
      setResolvedTheme(resolveTheme(event.matches))
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }

    return undefined
  }, [])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  return resolvedTheme
}
