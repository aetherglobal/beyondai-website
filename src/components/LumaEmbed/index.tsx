import React from 'react'
import { Button } from '@/components/ui/button'

export const LumaEmbed: React.FC<{
  embedUrl?: string | null
  eventUrl?: string | null
  className?: string
}> = ({ embedUrl, eventUrl, className }) => {
  if (embedUrl) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 'none', borderRadius: '8px' }}
          allowFullScreen
          title="Event Registration"
        />
      </div>
    )
  }

  if (eventUrl) {
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
