import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'

import type { Event } from '@/payload-types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  'ai-watch': 'AI Watch',
  'nyansa-futures': 'Nyansa Futures',
  'beyond-the-algorithm': 'Beyond the Algorithm',
  other: 'Event',
}

export const EventCard: React.FC<{
  event: Event
  className?: string
}> = ({ event, className }) => {
  const { title, slug, date, location, isVirtual, heroImage, lumaEventUrl, eventStatus, eventType } = event

  const d = new Date(date)
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = d.getDate()
  const formattedDate = d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <article
      className={`group border-t-2 border-transparent hover:border-primary bg-card text-card-foreground transition-all duration-300 overflow-hidden ${className || ''}`}
    >
      {heroImage && typeof heroImage !== 'number' && (
        <Link href={`/events/${slug}`} className="block">
          <div className="relative aspect-video overflow-hidden">
            <Media resource={heroImage} fill imgClassName="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-center shrink-0">
            <div className="text-xs font-mono text-primary uppercase tracking-wider">{month}</div>
            <div className="text-2xl font-bold leading-none mt-0.5">{day}</div>
          </div>

          <div className="flex-1 min-w-0">
            {eventStatus === 'cancelled' && (
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-destructive border border-destructive/30 mb-2">
                Cancelled
              </span>
            )}
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary/80 border border-primary/20 mb-2">
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </span>

            <h3 className="text-lg font-bold tracking-tight mb-1">
              <Link href={`/events/${slug}`} className="hover:text-primary transition-colors">
                {title}
              </Link>
            </h3>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedTime}
              </span>
              {(location || isVirtual) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {isVirtual ? 'Virtual' : ''}
                  {isVirtual && location ? ' · ' : ''}
                  {location || ''}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/events/${slug}`}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:brightness-110 transition-all"
              >
                Details
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
              {lumaEventUrl && eventStatus === 'upcoming' && (
                <a
                  href={lumaEventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-primary text-primary hover:bg-primary/10 transition-all"
                >
                  Register
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
