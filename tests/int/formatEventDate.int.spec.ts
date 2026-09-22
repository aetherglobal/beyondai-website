import { describe, it, expect, afterEach } from 'vitest'

import { eventDateParts, eventDate, eventDateRange, eventTime } from '@/utilities/formatEventDate'

const EVENING = '2026-03-14T18:30:00.000Z'
const originalTz = process.env.TZ

const withTimeZone = (tz: string, fn: () => void) => {
  process.env.TZ = tz
  fn()
}

afterEach(() => {
  process.env.TZ = originalTz
})

describe('event date formatting', () => {
  it('renders Accra wall-clock time regardless of the host timezone', () => {
    const reference = eventDateParts(EVENING)

    for (const tz of ['America/Los_Angeles', 'Asia/Tokyo', 'Europe/Berlin', 'UTC']) {
      withTimeZone(tz, () => {
        expect(eventDateParts(EVENING)).toEqual(reference)
      })
    }

    expect(reference).toEqual({ month: 'MAR', day: 14, time: '6:30 PM' })
  })

  it('does not roll the day over in a far-ahead timezone', () => {
    withTimeZone('Asia/Tokyo', () => {
      expect(eventDateParts(EVENING).day).toBe(14)
      expect(eventTime(EVENING)).toBe('6:30 PM')
    })
  })

  it('formats a full date with and without the weekday', () => {
    expect(eventDate(EVENING)).toBe('Saturday, March 14, 2026')
    expect(eventDate(EVENING, { weekday: false })).toBe('March 14, 2026')
  })

  it('formats a single date and a same-year range', () => {
    expect(eventDateRange(EVENING)).toBe('March 14, 2026')
    expect(eventDateRange(EVENING, '2026-03-16T18:30:00.000Z')).toBe('March 14 - 16, 2026')
  })

  it('shows both years when a range crosses a year boundary', () => {
    expect(eventDateRange('2026-12-30T10:00:00.000Z', '2027-01-02T10:00:00.000Z')).toBe(
      'December 30, 2026 - January 2, 2027',
    )
  })
})
