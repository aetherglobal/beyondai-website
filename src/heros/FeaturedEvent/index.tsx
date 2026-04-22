import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Event, Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { CountdownTimer } from '@/components/CountdownTimer'

type HeroProps = NonNullable<Page['hero']>

export const FeaturedEventHero: React.FC<HeroProps> = async (props) => {
  const {
    eyebrow,
    title,
    subtitle,
    ctas,
    bindNextEvent,
    fallbackImage,
  } = props as HeroProps & {
    eyebrow?: string | null
    title?: string | null
    subtitle?: string | null
    ctas?:
      | Array<{
          label: string
          href?: string | null
          variant?: 'primary' | 'outline' | null
          useEventLumaUrl?: boolean | null
        }>
      | null
    bindNextEvent?: boolean | null
    fallbackImage?: HeroProps['media']
  }

  let nextEvent: Event | null = null
  if (bindNextEvent) {
    try {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'events',
        where: {
          eventStatus: { equals: 'upcoming' },
          _status: { equals: 'published' },
        },
        sort: 'date',
        limit: 1,
        depth: 1,
      })
      nextEvent = (result.docs[0] as Event) ?? null
    } catch {
      nextEvent = null
    }
  }

  const heroImage =
    nextEvent?.heroImage && typeof nextEvent.heroImage !== 'number'
      ? nextEvent.heroImage
      : fallbackImage && typeof fallbackImage !== 'number'
        ? fallbackImage
        : null

  return (
    <>
      <section className="relative bg-dark flex items-center overflow-hidden">
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-0 right-0 bottom-0 w-[55%]">
            {heroImage ? (
              <Media resource={heroImage} fill imgClassName="object-cover" />
            ) : (
              <div className="w-full h-full bg-card" />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-dark via-dark/70 to-transparent" />
          </div>
        </div>

        <div className="container relative z-10 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              {eyebrow && (
                <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">
                  {eyebrow}
                </p>
              )}

              {title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-bold tracking-tight leading-[1.1] mb-6">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-6 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {Array.isArray(ctas) && ctas.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {ctas.map((cta, i) => {
                    const resolvedHref =
                      cta.useEventLumaUrl && nextEvent?.lumaEventUrl
                        ? nextEvent.lumaEventUrl
                        : cta.href || '#'
                    const isExternal = /^https?:\/\//i.test(resolvedHref)
                    const classes =
                      cta.variant === 'outline'
                        ? 'inline-flex items-center px-7 py-3.5 border border-primary-deep text-primary-deep font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all'
                        : 'inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all'

                    if (isExternal) {
                      return (
                        <a
                          key={i}
                          href={resolvedHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes}
                        >
                          {cta.label}
                        </a>
                      )
                    }
                    return (
                      <Link key={i} href={resolvedHref} className={classes}>
                        {cta.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="lg:hidden aspect-video overflow-hidden relative">
              {heroImage ? (
                <Media resource={heroImage} fill imgClassName="object-cover" />
              ) : (
                <div className="w-full h-full bg-card" />
              )}
            </div>
          </div>
        </div>
      </section>

      {nextEvent && (
        <section className="bg-dark border-t border-primary-deep/20">
          <div className="container py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Next event
                </p>
                <p className="text-foreground text-lg font-medium">
                  {new Date(nextEvent.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                  {nextEvent.endDate && (
                    <>
                      {' - '}
                      {new Date(nextEvent.endDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </>
                  )}
                  {!nextEvent.endDate && <>, {new Date(nextEvent.date).getFullYear()}</>}
                  {nextEvent.location && (
                    <span className="text-muted-foreground"> · {nextEvent.location}</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Starts in
                </p>
                <CountdownTimer targetDate={nextEvent.date} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
