import { describe, it, expect, afterEach } from 'vitest'

import { formatDateTime } from '@/utilities/formatDateTime'

describe('formatDateTime hydration safety', () => {
  const originalTz = process.env.TZ
  afterEach(() => {
    process.env.TZ = originalTz
  })

  it('formats a timestamp identically regardless of the host timezone', () => {
    // 23:30 UTC lands on a different calendar day depending on the zone:
    // Asia/Tokyo (UTC+9) rolls to the next day, America/Los_Angeles (UTC-7) stays.
    // A server in one zone and a browser in another must still render the same
    // text, or React throws hydration error #418.
    const timestamp = '2026-06-22T23:30:00.000Z'

    process.env.TZ = 'America/Los_Angeles'
    const la = formatDateTime(timestamp)

    process.env.TZ = 'Asia/Tokyo'
    const tokyo = formatDateTime(timestamp)

    expect(la).toBe(tokyo)
    expect(la).toBe('06/22/2026') // stable, UTC-based date
  })
})
