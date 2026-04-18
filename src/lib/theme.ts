import { useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY } from '../data/constants'
import type { ResolvedTheme, ThemePreference } from '../types'

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

function getStoredThemePreference(): ThemePreference {
  if (!canUseBrowser()) {
    return 'system'
  }

  let storedValue: string | null = null

  try {
    storedValue = window.localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return 'system'
  }

  if (
    storedValue === 'system' ||
    storedValue === 'light' ||
    storedValue === 'dark'
  ) {
    return storedValue
  }

  return 'system'
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean
): ResolvedTheme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light'
  }

  return preference
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  if (!canUseBrowser()) {
    return
  }

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    getStoredThemePreference()
  )
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    getSystemDarkPreference()
  )

  useEffect(() => {
    const mediaQuery = getColorSchemeMediaQuery()

    if (!mediaQuery) {
      return undefined
    }

    function handleChange(event: MediaQueryListEvent) {
      setSystemPrefersDark(event.matches)
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

  const resolvedTheme = useMemo(
    () => resolveTheme(preference, systemPrefersDark),
    [preference, systemPrefersDark]
  )

  useEffect(() => {
    if (!canUseBrowser()) {
      return
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      // Ignore blocked storage environments such as stricter in-app browsers.
    }
  }, [preference])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  return {
    preference,
    resolvedTheme,
    setPreference,
  }
}
