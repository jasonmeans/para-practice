import { describe, expect, it, vi, afterEach } from 'vitest'
import { resolveLocalApiBaseUrl } from './publicBridge'

describe('public bridge config', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps the explicit backend url off GitHub Pages', () => {
    vi.stubGlobal('window', {
      location: {
        host: '127.0.0.1:3000',
        pathname: '/',
      },
    })

    expect(resolveLocalApiBaseUrl('https://example.com/')).toBe(
      'https://example.com'
    )
  })

  it('uses the active Pages bridge on the published site', () => {
    vi.stubGlobal('window', {
      location: {
        host: 'jasonmeans.github.io',
        pathname: '/para-practice/',
      },
    })

    expect(resolveLocalApiBaseUrl('https://stale.example.com')).toBe(
      'https://subscriptions-friendship-luxury-sees.trycloudflare.com'
    )
  })
})
