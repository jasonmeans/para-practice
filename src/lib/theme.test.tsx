import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useThemePreference } from './theme'

function ThemeProbe() {
  const { preference, resolvedTheme } = useThemePreference()

  return (
    <p>
      {preference}:{resolvedTheme}
    </p>
  )
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

    expect(screen.getByText('system:light')).toBeInTheDocument()
  })

  it('keeps rendering when storage access throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    render(<ThemeProbe />)

    expect(screen.getByText('system:light')).toBeInTheDocument()
  })
})
