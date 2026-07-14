'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { sendGAEvent } from '@next/third-parties/google'

export function AnalyticsPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    sendGAEvent('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
