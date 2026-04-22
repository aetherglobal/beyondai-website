import React from 'react'

import type { PastEventsBlockType } from '@/payload-types'
import { EventCard } from '@/components/EventCard'
import { FadeIn } from '@/components/FadeIn'
import { getPastEvents } from '@/blocks/_data/cached-queries'

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
