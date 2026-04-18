import { useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY } from '../data/constants'
import type { ResolvedTheme, ThemePreference } from '../types'

function getSystemDarkPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredThemePreference(): ThemePreference {
  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY)

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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(event: MediaQueryListEvent) {
      setSystemPrefersDark(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const resolvedTheme = useMemo(
    () => resolveTheme(preference, systemPrefersDark),
    [preference, systemPrefersDark]
  )

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
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
