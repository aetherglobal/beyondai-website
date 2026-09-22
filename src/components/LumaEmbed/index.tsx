import React from 'react'
import { Button } from '@/components/ui/button'

import { isSafeHref } from '@/utilities/resolveLinkHref'

const LUMA_HOSTS = new Set(['lu.ma', 'www.lu.ma'])

const isLumaUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && LUMA_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

export const LumaEmbed: React.FC<{
  embedUrl?: string | null
  eventUrl?: string | null
  className?: string
}> = ({ embedUrl, eventUrl, className }) => {
  if (embedUrl && isLumaUrl(embedUrl)) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          width="100%"
          height="600"
          frameBorder="0"
          loading="lazy"
          style={{ border: 'none', borderRadius: '8px' }}
          allowFullScreen
          title="Event Registration"
        />
      </div>
    )
  }

  if (eventUrl && isSafeHref(eventUrl)) {
    return (
      <div className={className}>
        <Button asChild size="lg">
          <a href={eventUrl} target="_blank" rel="noopener noreferrer">
            Register on Luma
          </a>
        </Button>
      </div>
    )
  }

  return null
}
