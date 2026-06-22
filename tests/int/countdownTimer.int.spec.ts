import React from 'react'
import { renderToString } from 'react-dom/server'
import { describe, it, expect, vi, afterEach } from 'vitest'

import { CountdownTimer } from '@/components/CountdownTimer'

describe('CountdownTimer hydration safety', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders identical server markup regardless of the wall clock (no hydration mismatch)', () => {
    const targetDate = '2099-01-01T00:00:00.000Z'

    // First (server) render at one instant.
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000_000_000)
    const serverMarkup = renderToString(React.createElement(CountdownTimer, { targetDate }))

    // First client render happens a moment later. Its initial output MUST match the
    // server markup, or React throws hydration error #418 (text content mismatch).
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000_005_000) // 5 seconds later
    const clientMarkup = renderToString(React.createElement(CountdownTimer, { targetDate }))

    expect(clientMarkup).toBe(serverMarkup)
  })
})
