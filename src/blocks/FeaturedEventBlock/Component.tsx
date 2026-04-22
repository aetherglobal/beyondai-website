import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

import type { FeaturedEventBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
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
    full: d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

type Props = FeaturedEventBlockType & { disableInnerContainer?: boolean }

export const FeaturedEventBlockComponent: React.FC<Props> = async ({ eyebrow }) => {
  const events = await getUpcomingEvents(1)
  const event = events[0]
  if (!event) return null

  const { title, slug, date, location, isVirtual, heroImage, lumaEventUrl, eventType } = event
  const d = formatEventDate(date)

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container">
        {eyebrow && (
          <FadeIn>
            <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
              {eyebrow}
            </p>
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {heroImage && typeof heroImage !== 'number' && (
              <div className="lg:col-span-6">
                <Link href={`/events/${slug}`} className="block">
                  <div className="relative aspect-video border-t-2 border-primary-deep overflow-hidden">
                    <Media resource={heroImage} fill imgClassName="object-cover" />
                  </div>
                </Link>
              </div>
            )}

            <div
              className={
                heroImage && typeof heroImage !== 'number' ? 'lg:col-span-6' : 'lg:col-span-12'
              }
            >
              <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary-deep border border-primary-deep/30 mb-4">
                {EVENT_TYPE_LABELS[eventType] || eventType}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-4 text-gray-900">
                <Link
                  href={`/events/${slug}`}
                  className="hover:text-primary-deep transition-colors"
                >
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
                    className="inline-flex items-center px-7 py-3.5 border border-primary-deep text-primary-deep font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
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
