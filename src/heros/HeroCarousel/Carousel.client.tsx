'use client'

import React from 'react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { Carousel, CarouselContent, CarouselItem, useCarousel } from '@/components/ui/carousel'

export type CarouselCta = {
  label: string
  href: string
  variant: 'primary' | 'outline'
  isExternal: boolean
}

export type CarouselSlide = {
  eyebrow?: string | null
  title: string
  headingAccent?: string | null
  subtitle?: string | null
  media: MediaType | null
  ctas: CarouselCta[]
}

const ctaClasses = (variant: 'primary' | 'outline') =>
  variant === 'outline'
    ? 'inline-flex items-center px-7 py-3.5 border border-white text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-all'
    : 'inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all'

const HeroSlide: React.FC<{ slide: CarouselSlide; first: boolean }> = ({ slide, first }) => {
  const { eyebrow, title, headingAccent, subtitle, media, ctas } = slide
  const Heading = first ? 'h1' : 'h2'

  return (
    <section className="relative bg-dark flex items-center overflow-hidden min-h-[var(--hero-h)] pb-24 md:pb-0">
      <div className="absolute inset-0 select-none">
        {media ? (
          <Media resource={media} fill imgClassName="object-cover" size="100vw" priority={first} />
        ) : (
          <div className="w-full h-full bg-dark" />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container relative z-10 py-6 md:py-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm tracking-widest uppercase text-white/80 mb-4">{eyebrow}</p>
          )}

          {(title || headingAccent) && (
            <Heading className="text-hero text-white font-bold tracking-tight mb-6">
              {title}
              {headingAccent && (
                <>
                  {title && ' '}
                  <span className="text-primary">{headingAccent}</span>
                </>
              )}
            </Heading>
          )}

          {subtitle && (
            <p className="text-base md:text-lg text-white/85 max-w-lg mb-6 leading-relaxed text-justify hyphens-auto">
              {subtitle}
            </p>
          )}

          {ctas.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {ctas.map((cta, i) =>
                cta.isExternal ? (
                  <a
                    key={i}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaClasses(cta.variant)}
                  >
                    {cta.label}
                  </a>
                ) : (
                  <Link key={i} href={cta.href} className={ctaClasses(cta.variant)}>
                    {cta.label}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const SlideControls: React.FC<{ count: number }> = ({ count }) => {
  const { api, scrollPrev, scrollNext } = useCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  const arrowClasses =
    'flex size-9 items-center justify-center bg-primary text-dark transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80'

  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      <button type="button" aria-label="Previous slide" onClick={scrollPrev} className={arrowClasses}>
        <ChevronLeft className="size-5" />
      </button>

      <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === selectedIndex}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-1.5 transition-all duration-300',
              i === selectedIndex
                ? 'w-8 bg-primary'
                : 'w-2.5 bg-foreground/40 hover:bg-foreground/70',
            )}
          />
        ))}
      </div>

      <button type="button" aria-label="Next slide" onClick={scrollNext} className={arrowClasses}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}

export const HeroCarouselClient: React.FC<{ slides: CarouselSlide[] }> = ({ slides }) => {
  const reduceMotion = useReducedMotion()
  const hasMultiple = slides.length > 1

  const plugins = React.useMemo(
    () =>
      hasMultiple && !reduceMotion
        ? [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]
        : [],
    [hasMultiple, reduceMotion],
  )

  return (
    <Carousel
      className="bg-dark"
      opts={{ loop: true, align: 'start' }}
      plugins={plugins}
      aria-label="Featured highlights"
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, i) => (
          <CarouselItem key={i} className="pl-0">
            <HeroSlide slide={slide} first={i === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {hasMultiple && <SlideControls count={slides.length} />}
    </Carousel>
  )
}
