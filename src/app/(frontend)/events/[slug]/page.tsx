import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Globe } from 'lucide-react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { LumaEmbed } from '@/components/LumaEmbed'
import { SponsorGrid } from '@/components/SponsorGrid'
import { FadeIn } from '@/components/FadeIn'

import type { Event, Sponsor } from '@/payload-types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  'ai-watch': 'AI Watch — Monthly Forum',
  'nyansa-futures': 'Nyansa Futures — Conference',
  'beyond-the-algorithm': 'Beyond the Algorithm',
  other: 'Event',
}

const BREAK_KEYWORDS = [
  'break',
  'lunch',
  'intermission',
  'networking',
  'reception',
  'dinner',
  'coffee',
  'tea',
  'registration',
  'check-in',
]

function isBreakItem(item: { time: string; title: string }): boolean {
  if (!item.time || item.time.trim() === '') return true
  const lower = item.title.toLowerCase()
  return BREAK_KEYWORDS.some((keyword) => lower.includes(keyword))
}

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return events.docs.map(({ slug }) => ({ slug }))
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug })

  if (!event) {
    notFound()
  }

  const {
    title,
    date,
    endDate,
    location,
    isVirtual,
    description,
    heroImage,
    speakers,
    agenda,
    lumaEventUrl,
    lumaEmbedUrl,
    partnerLogos,
    eventType,
  } = event

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

  const partners = (partnerLogos || []).filter((s): s is Sponsor => typeof s !== 'number')
  const hasHeroImage = heroImage && typeof heroImage !== 'number'

  return (
    <article>
      <section className="relative min-h-[70vh] bg-dark flex items-end overflow-hidden">
        {hasHeroImage && (
          <>
            <div className="absolute inset-0">
              <Media resource={heroImage} fill imgClassName="object-cover" />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/70 to-dark/30" />
          </>
        )}
        {!hasHeroImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(83.5% 0.16 165.7 / 0.07) 0%, transparent 70%)',
            }}
          />
        )}

        <div className="container relative z-10 py-16 md:py-24">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary-deep border border-primary-deep/30">
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </span>
            {isVirtual && (
              <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-foreground/60 border border-foreground/20">
                Virtual Event
              </span>
            )}
          </div>

          <h1 className="text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1] mb-8 max-w-4xl">
            {title}
          </h1>

          <div className="flex flex-wrap gap-6 text-foreground/80 mb-10">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-deep" />
              {formattedDate} at {formattedTime}
            </span>
            {endDate && (
              <span>
                &mdash;{' '}
                {new Date(endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-deep" />
                {location}
              </span>
            )}
            {isVirtual && (
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary-deep" />
                Virtual
              </span>
            )}
          </div>

          {lumaEventUrl && (
            <a
              href={lumaEventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Register to Attend
            </a>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {description && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-4">
                  <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
                    [About This Event]
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide text-gray-900">
                    What to Expect
                  </h2>
                  <div className="w-16 h-0.5 bg-primary mt-4" />
                </div>
                <div className="lg:col-span-8">
                  <div className="bg-white prose [&_p]:text-gray-700 [&_li]:text-gray-700 [&_h2]:text-gray-900 [&_h3]:text-gray-900 max-w-none">
                    <RichText data={description} enableGutter={false} />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {speakers && speakers.length > 0 && (
        <section className="bg-dark py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
                [Speakers]
              </p>
              <h2 className="text-3xl text-foreground md:text-4xl font-bold uppercase tracking-tight mb-12">
                Who&apos;s Speaking
              </h2>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {speakers.map((speaker, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="text-center group">
                    {speaker.photo && typeof speaker.photo !== 'number' ? (
                      <div
                        className="relative w-40 h-40 mx-auto mb-4 overflow-hidden border-2 border-transparent group-hover:border-primary-deep transition-colors"
                        style={{
                          clipPath:
                            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                        }}
                      >
                        <Media resource={speaker.photo} fill imgClassName="object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-40 h-40 mx-auto mb-4 bg-card flex items-center justify-center"
                        style={{
                          clipPath:
                            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                        }}
                      >
                        <span className="text-2xl font-bold text-primary-deep/40">
                          {speaker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground text-sm">{speaker.name}</h3>
                    {speaker.title && (
                      <p className="text-xs text-muted-foreground mt-1">{speaker.title}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {agenda && agenda.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono">
                [Schedule]
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-16 text-gray-900">
                Schedule
              </h2>
            </FadeIn>

            <div>
              {agenda.map((item, i) => {
                const isBreak = isBreakItem(item)

                if (isBreak) {
                  return (
                    <FadeIn key={i} delay={i * 0.04}>
                      <div className="my-6">
                        <div className="bg-gray-100 py-8 px-8 md:px-12 rounded-lg">
                          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-900">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-500 mt-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  )
                }

                return (
                  <FadeIn key={i} delay={i * 0.04}>
                    <div className="border-t border-gray-200 py-8 md:py-10">
                      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_120px] gap-4 md:gap-8 items-start">
                        <div className="text-sm font-mono text-gray-400">
                          {item.time && `[ ${item.time} ]`}
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-500 leading-relaxed max-w-2xl">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="hidden lg:block" />
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {(lumaEmbedUrl || lumaEventUrl) && (
        <section className="bg-dark py-16 md:py-20">
          <div className="container max-w-3xl mx-auto">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4 font-mono text-center">
                [Registration]
              </p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8 text-foreground text-center">
                Register Now
              </h2>
              <LumaEmbed className="text-center" embedUrl={lumaEmbedUrl} eventUrl={lumaEventUrl} />
            </FadeIn>
          </div>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug })

  if (!event) return {}

  return {
    title: `${event.title} — Beyond AI`,
    description: `Join us for ${event.title} on ${new Date(event.date).toLocaleDateString()}.`,
  }
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    limit: 1,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  return (result.docs?.[0] as Event) || null
})
