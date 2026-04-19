import { afterEach, describe, expect, it, vi } from 'vitest'
import { createId } from './id'

describe('createId', () => {
  const originalCrypto = globalThis.crypto

  afterEach(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  it('uses crypto.randomUUID when available', () => {
    const randomUUID = vi.fn(() => 'known-id')
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        ...originalCrypto,
        randomUUID,
      },
      configurable: true,
    })

    expect(createId()).toBe('known-id')
    expect(randomUUID).toHaveBeenCalledOnce()
  })

  it('falls back to getRandomValues when randomUUID is unavailable', () => {
    const getRandomValues = vi.fn((buffer: Uint8Array) => {
      buffer.set([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ])
      return buffer
    })

    Object.defineProperty(globalThis, 'crypto', {
      value: {
        ...originalCrypto,
        randomUUID: undefined,
        getRandomValues,
      },
      configurable: true,
    })

    expect(createId()).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
    expect(getRandomValues).toHaveBeenCalledOnce()
  })
})
