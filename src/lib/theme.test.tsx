import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useThemePreference } from './theme'

function ThemeProbe() {
  const resolvedTheme = useThemePreference()

  return <p>{resolvedTheme}</p>
}

describe('useThemePreference', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    cleanup()
    Object.defineProperty(window, 'matchMedia', {
      value: originalMatchMedia,
      configurable: true,
      writable: true,
    })
    vi.restoreAllMocks()
  })

  it('falls back safely when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    render(<ThemeProbe />)

    expect(screen.getByText('light')).toBeInTheDocument()
  })

  it('follows a dark system preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      configurable: true,
      writable: true,
    })

    render(<ThemeProbe />)

    expect(screen.getByText('dark')).toBeInTheDocument()
  })
})
