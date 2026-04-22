import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { PastEventsBlockType } from '@/payload-types'
import { FadeIn } from '@/components/FadeIn'
import { getPastEvents } from '@/blocks/_data/cached-queries'
import type { Event } from '@/payload-types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  'ai-watch': 'AI Watch — Monthly Forum',
  'nyansa-futures': 'Nyansa Futures — Conference',
  'beyond-the-algorithm': 'Beyond the Algorithm',
  other: 'Event',
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    full: d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
  }
}

type Props = PastEventsBlockType & { disableInnerContainer?: boolean }

export const PastEventsBlockComponent: React.FC<Props> = async ({ eyebrow, heading, limit }) => {
  const events = await getPastEvents(limit ?? 20)
  if (events.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container">
        <FadeIn>
          {eyebrow && (
            <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-10 text-gray-900">
              {heading}
            </h2>
          )}
        </FadeIn>
        <div className="divide-y divide-gray-200">
          {events.map((event, i) => (
            <FadeIn key={event.id} delay={i * 0.05}>
              <PastEventRow event={event} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PastEventRow({ event }: { event: Event }) {
  const { title, slug, date, location, eventType } = event
  const d = formatEventDate(date)

  return (
    <Link href={`/events/${slug}`} className="group block py-5 first:pt-0">
      <div className="flex items-center gap-6">
        <div className="text-sm font-mono text-gray-400 min-w-[140px] hidden sm:block">
          {d.full}
        </div>
        <div className="text-sm font-mono text-gray-400 sm:hidden min-w-[60px]">
          {d.month} {d.day}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-deep transition-colors truncate">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 hidden md:block">
          {EVENT_TYPE_LABELS[eventType] || eventType}
        </span>
        {location && <span className="text-sm text-gray-400 hidden lg:block">{location}</span>}
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-deep transition-colors shrink-0" />
      </div>
    </Link>
  )
}
