import { describe, expect, it } from 'vitest'
import { loaClient } from '@/lib/loaClient'

describe('loaClient', () => {
  it('capitalizes strings', () => {
    const result = loaClient.capitalize({ value: 'hello' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe('Hello')
    }
  })

  it('converts string to slug', () => {
    const result = loaClient.stringToSlug({
      value: 'Hôtel & Spa, all inclusive.',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe('hotel-&-spa-all-inclusive')
    }
  })

  it('generates time-based random string', () => {
    const result = loaClient.timeBasedRandomString({ length: 12 })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(12)
      expect(result.data).toMatch(/^[A-Za-z0-9]+$/)
    }
  })
})

