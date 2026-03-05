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
})

