import React from 'react'
import Link from 'next/link'

import type { Event, UpcomingEventsBlockType } from '@/payload-types'
import { EventCard } from '@/components/EventCard'
import { FadeIn } from '@/components/FadeIn'
import { getUpcomingEvents } from '@/blocks/_data/cached-queries'

const EVENT_TYPE_LABELS: Record<string, string> = {
  'ai-watch': 'AI Watch — Monthly Forum',
  'nyansa-futures': 'Nyansa Futures — Conference',
  'beyond-the-algorithm': 'Beyond the Algorithm',
  other: 'Event',
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

type Props = UpcomingEventsBlockType & { disableInnerContainer?: boolean }

export const UpcomingEventsBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  ctaLabel,
  ctaHref,
  variant,
  skipFirst,
  limit,
}) => {
  const requested = limit ?? 3
  const fetchCount = skipFirst ? requested + 1 : requested
  const allEvents = await getUpcomingEvents(fetchCount)
  const events = skipFirst ? allEvents.slice(1) : allEvents
  if (events.length === 0) return null

  if (variant === 'numberedList') {
    return (
      <section className="bg-dark py-16 md:py-20">
        <div className="container">
          <FadeIn>
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-bold uppercase tracking-tight leading-[1.1] mb-12">
                {heading}
              </h2>
            )}
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.08}>
                <UpcomingEventRow event={event} index={i + 1} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          {heading && <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-gray-900">{heading}</h2>}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-primary hover:border-primary-deep hover:text-primary-foreground transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

function UpcomingEventRow({ event, index }: { event: Event; index: number }) {
  const { title, slug, date, location, isVirtual, eventType } = event
  const d = formatEventDate(date)

  return (
    <Link href={`/events/${slug}`} className="group block">
      <div className="p-6 md:p-8 bg-card border-l-2 border-transparent hover:border-primary-deep transition-all duration-300">
        <div className="flex items-start gap-5">
          <div className="text-center shrink-0">
            <div className="text-xs font-mono text-primary-deep uppercase tracking-wider">
              {d.month}
            </div>
            <div className="text-3xl font-bold text-foreground leading-none mt-1">{d.day}</div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary-deep/80 border border-primary-deep/20 mb-2">
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </span>
            <h3 className="text-lg font-bold text-foreground tracking-tight mb-1 group-hover:text-primary-deep transition-colors">
              {title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{d.time}</span>
              {(location || isVirtual) && (
                <span>
                  · {isVirtual ? 'Virtual' : ''}
                  {isVirtual && location ? ' · ' : ''}
                  {location || ''}
                </span>
              )}
            </div>
          </div>

          <span className="text-3xl font-bold text-primary-deep/20 group-hover:text-primary-deep/40 transition-colors font-mono shrink-0 hidden sm:block">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </Link>
  )
}
