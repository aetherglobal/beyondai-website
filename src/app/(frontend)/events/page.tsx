import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { EventCard } from '@/components/EventCard'

import type { Event } from '@/payload-types'

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })

  const [upcomingResult, pastResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { eventStatus: { equals: 'upcoming' }, _status: { equals: 'published' } },
      sort: 'date',
      limit: 20,
      depth: 1,
    }),
    payload.find({
      collection: 'events',
      where: { eventStatus: { equals: 'past' }, _status: { equals: 'published' } },
      sort: '-date',
      limit: 20,
      depth: 1,
    }),
  ])

  const upcomingEvents = upcomingResult.docs as Event[]
  const pastEvents = pastResult.docs as Event[]

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Join our forums, workshops, and conferences exploring AI governance and digital
          transformation in Africa.
        </p>
      </section>

      {/* Upcoming Events */}
      <section className="container py-8">
        <h2 className="text-2xl font-semibold mb-8">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No upcoming events at the moment. Check back soon or subscribe to our newsletter to stay
            informed.
          </p>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-semibold mb-8">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Events — Beyond AI',
  description:
    'Browse upcoming and past Beyond AI events including AI Watch forums, workshops, and the Nyansa Futures conference.',
}
