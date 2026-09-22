import { describe, it, expect, afterEach } from 'vitest'

import { formatDateTime } from '@/utilities/formatDateTime'

describe('formatDateTime hydration safety', () => {
  const originalTz = process.env.TZ
  afterEach(() => {
    process.env.TZ = originalTz
  })

  it('formats a timestamp identically regardless of the host timezone', () => {
    const timestamp = '2026-06-22T23:30:00.000Z'

    process.env.TZ = 'America/Los_Angeles'
    const la = formatDateTime(timestamp)

    process.env.TZ = 'Asia/Tokyo'
    const tokyo = formatDateTime(timestamp)

    expect(la).toBe(tokyo)
    expect(la).toBe('06/22/2026')
  })
})
