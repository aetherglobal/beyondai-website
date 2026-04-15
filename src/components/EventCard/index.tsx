import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'

import type { Event } from '@/payload-types'

export const EventCard: React.FC<{
  event: Event
  className?: string
}> = ({ event, className }) => {
  const { title, slug, date, location, isVirtual, heroImage, lumaEventUrl, eventStatus } = event

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <article
      className={`border border-border overflow-hidden bg-card text-card-foreground ${className || ''}`}
    >
      {heroImage && typeof heroImage !== 'number' && (
        <Link href={`/events/${slug}`} className="block">
          <Media resource={heroImage} className="w-full aspect-video object-cover" />
        </Link>
      )}
      <div className="p-6">
        {eventStatus === 'cancelled' && (
          <span className="text-xs font-medium text-destructive uppercase tracking-wide">
            Cancelled
          </span>
        )}
        <p className="text-sm text-muted-foreground mb-1">
          {formattedDate} at {formattedTime}
        </p>
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/events/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {(location || isVirtual) && (
          <p className="text-sm text-muted-foreground mb-4">
            {isVirtual ? 'Virtual Event' : ''}
            {isVirtual && location ? ' · ' : ''}
            {location || ''}
          </p>
        )}
        <div className="flex gap-3">
          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:brightness-110 transition-colors"
          >
            View Details
          </Link>
          {lumaEventUrl && eventStatus === 'upcoming' && (
            <a
              href={lumaEventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Register
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
