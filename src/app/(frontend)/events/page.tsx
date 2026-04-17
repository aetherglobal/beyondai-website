import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { FadeIn } from '@/components/FadeIn'

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
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    full: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })

  const [upcomingResult, pastResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { eventStatus: { equals: 'upcoming' }, _status: { equals: 'published' } },
      sort: 'date',
      limit: 20,
      depth: 2,
    }),
    payload.find({
      collection: 'events',
      where: { eventStatus: { equals: 'past' }, _status: { equals: 'published' } },
      sort: '-date',
      limit: 20,
      depth: 2,
    }),
  ])

  const upcomingEvents = upcomingResult.docs as Event[]
  const pastEvents = pastResult.docs as Event[]

  const featuredEvent = upcomingEvents[0] || null
  const remainingUpcoming = upcomingEvents.slice(1)

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[70vh] bg-dark flex items-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(83.5% 0.16 165.7 / 0.07) 0%, transparent 70%)',
          }}
        />

        <div className="container relative z-10 py-20 md:py-28">
          <p className="text-sm tracking-widest uppercase text-primary mb-6 font-mono">[Events]</p>

          <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Forums, Workshops &
            <br />
            Conferences On
            <br />
            <span className="text-primary">AI Governance</span>
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
            Join our events exploring AI governance and digital transformation in Africa — from
            monthly AI Watch forums to the annual Nyansa Futures conference.
          </p>

          <Link
            href="#footer-newsletter"
            className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
          >
            Subscribe for Updates
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {/* Featured Event */}
      {featuredEvent && <FeaturedEvent event={featuredEvent} />}

      {/* Remaining Upcoming Events */}
      {remainingUpcoming.length > 0 && (
        <section className="bg-dark py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4 font-mono">
                [Upcoming]
              </p>
              <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-12">
                More Upcoming Events
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remainingUpcoming.map((event, i) => (
                <FadeIn key={event.id} delay={i * 0.08}>
                  <UpcomingEventCard event={event} index={i + 1} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {upcomingEvents.length === 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container text-center max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4 font-mono">
                [Stay Tuned]
              </p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 text-gray-900">
                No Upcoming Events
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We&apos;re planning our next event. Subscribe to our newsletter to be the first to
                know when we announce new forums, workshops, and conferences.
              </p>
              <Link
                href="#footer-newsletter"
                className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Subscribe to Newsletter
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4 font-mono">
                [Past Events]
              </p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-10 text-gray-900">
                Previous Events
              </h2>
            </FadeIn>
            <div className="divide-y divide-gray-200">
              {pastEvents.map((event, i) => (
                <FadeIn key={event.id} delay={i * 0.05}>
                  <PastEventRow event={event} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

function FeaturedEvent({ event }: { event: Event }) {
  const { title, slug, date, location, isVirtual, heroImage, lumaEventUrl, eventType } = event
  const d = formatEventDate(date)

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container">
        <FadeIn>
          <p className="text-sm tracking-widest uppercase text-primary mb-4 font-mono">
            [Next Event]
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {heroImage && typeof heroImage !== 'number' && (
              <div className="lg:col-span-6">
                <Link href={`/events/${slug}`} className="block">
                  <div className="relative aspect-video border-t-2 border-primary overflow-hidden">
                    <Media resource={heroImage} fill imgClassName="object-cover" />
                  </div>
                </Link>
              </div>
            )}

            <div className={heroImage && typeof heroImage !== 'number' ? 'lg:col-span-6' : 'lg:col-span-12'}>
              <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary border border-primary/30 mb-4">
                {EVENT_TYPE_LABELS[eventType] || eventType}
              </span>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4 text-gray-900">
                <Link href={`/events/${slug}`} className="hover:text-primary transition-colors">
                  {title}
                </Link>
              </h2>

              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {d.full} at {d.time}
                </span>
                {(location || isVirtual) && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isVirtual ? 'Virtual Event' : ''}
                    {isVirtual && location ? ' · ' : ''}
                    {location || ''}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/events/${slug}`}
                  className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {lumaEventUrl && (
                  <a
                    href={lumaEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
                  >
                    Register
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function UpcomingEventCard({ event, index }: { event: Event; index: number }) {
  const { title, slug, date, location, isVirtual, eventType, lumaEventUrl } = event
  const d = formatEventDate(date)

  return (
    <Link href={`/events/${slug}`} className="group block">
      <div className="p-6 md:p-8 bg-card border-l-2 border-transparent hover:border-primary transition-all duration-300">
        <div className="flex items-start gap-5">
          <div className="text-center shrink-0">
            <div className="text-xs font-mono text-primary uppercase tracking-wider">{d.month}</div>
            <div className="text-3xl font-bold text-white leading-none mt-1">{d.day}</div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary/80 border border-primary/20 mb-2">
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-primary transition-colors">
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

          <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors font-mono shrink-0 hidden sm:block">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </Link>
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
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 hidden md:block">
          {EVENT_TYPE_LABELS[eventType] || eventType}
        </span>
        {location && (
          <span className="text-sm text-gray-400 hidden lg:block">{location}</span>
        )}
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
      </div>
    </Link>
  )
}

export const metadata: Metadata = {
  title: 'Events — Beyond AI',
  description:
    'Browse upcoming and past Beyond AI events including AI Watch forums, workshops, and the Nyansa Futures conference.',
}
