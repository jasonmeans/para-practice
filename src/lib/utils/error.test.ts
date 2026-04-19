import { describe, expect, it } from 'vitest'
import { getErrorMessage } from './error'

describe('getErrorMessage', () => {
  it('maps generic fetch failures to a clearer backend message', () => {
    expect(getErrorMessage(new Error('Load failed'))).toBe(
      'The saved-progress service is temporarily unavailable. Please refresh and try again in a moment.'
    )
    expect(getErrorMessage('Failed to fetch')).toBe(
      'The saved-progress service is temporarily unavailable. Please refresh and try again in a moment.'
    )
  })
})
