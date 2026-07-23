import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Event, Media, Page } from '@/payload-types'
import { CountdownTimer } from '@/components/CountdownTimer'

import { HeroCarouselClient, type CarouselSlide } from './Carousel.client'

type HeroProps = NonNullable<Page['hero']>

export const HeroCarousel: React.FC<HeroProps> = async (props) => {
  const { slides, bindNextEvent } = props

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

  const resolvedSlides: CarouselSlide[] = (slides ?? []).map((slide) => {
    const media = slide.media && typeof slide.media !== 'number' ? (slide.media as Media) : null

    const ctas = (slide.ctas ?? []).map((cta) => {
      const resolvedHref =
        cta.useEventLumaUrl && nextEvent?.lumaEventUrl ? nextEvent.lumaEventUrl : cta.href || '#'
      return {
        label: cta.label,
        href: resolvedHref,
        variant: (cta.variant ?? 'primary') as 'primary' | 'outline',
        isExternal: /^https?:\/\//i.test(resolvedHref),
      }
    })

    return {
      eyebrow: slide.eyebrow ?? null,
      title: slide.title,
      headingAccent: slide.headingAccent ?? null,
      subtitle: slide.subtitle ?? null,
      media,
      ctas,
    }
  })

  if (resolvedSlides.length === 0) return null

  return (
    <>
      <HeroCarouselClient slides={resolvedSlides} />

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
