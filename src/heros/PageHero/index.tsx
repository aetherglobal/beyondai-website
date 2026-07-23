import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'

type HeroProps = NonNullable<Page['hero']>

export const PageHero: React.FC<HeroProps> = (props) => {
  const { eyebrow, heading, headingAccent, subtitle, ctas, media } = props as HeroProps & {
    eyebrow?: string | null
    heading?: string | null
    headingAccent?: string | null
    subtitle?: string | null
    ctas?:
      | Array<{
          label: string
          href?: string | null
          variant?: 'primary' | 'outline' | null
        }>
      | null
  }

  const headingLines = heading
    ? heading.split(/\r?\n/).filter((line, i, arr) => line.length > 0 || i < arr.length - 1)
    : []

  const hasMedia = media && typeof media !== 'number'

  return (
    <section className="relative min-h-[var(--hero-h)] bg-dark flex items-center overflow-hidden">
      {hasMedia ? (
        <div className="absolute inset-0">
          <Media resource={media} fill imgClassName="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 28%, oklch(82% 0.17 85 / 0.14) 0%, transparent 72%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, oklch(58% 0.15 78 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(58% 0.15 78 / 0.06) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse 85% 80% at 50% 30%, black 25%, transparent 78%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 85% 80% at 50% 30%, black 25%, transparent 78%)',
            }}
          />
        </div>
      )}

      <div className="container relative z-10 py-20 md:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {eyebrow && (
            <p
              className={`flex items-center gap-3 text-sm tracking-widest uppercase mb-6 font-mono ${
                hasMedia ? 'text-white/80' : 'text-primary-deep'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-px w-8 ${hasMedia ? 'bg-white/50' : 'bg-primary-deep/60'}`}
              />
              {eyebrow}
            </p>
          )}

          {(headingLines.length > 0 || headingAccent) && (
            <h1
              className={`text-hero font-bold tracking-tight text-balance mb-8 ${
                hasMedia ? 'text-white' : 'text-foreground'
              }`}
            >
              {headingLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {(i < headingLines.length - 1 || headingAccent) && <br />}
                </React.Fragment>
              ))}
              {headingAccent && (
                <span className={hasMedia ? 'text-primary' : 'text-primary-deep'}>
                  {headingAccent}
                </span>
              )}
            </h1>
          )}

          {subtitle && (
            <p
              className={`text-lg max-w-2xl mb-10 leading-relaxed ${
                hasMedia ? 'text-white/85' : 'text-foreground/80'
              }`}
            >
              {subtitle}
            </p>
          )}

          {Array.isArray(ctas) && ctas.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {ctas.map((cta, i) => {
                const href = cta.href || '#'
                const isExternal = /^https?:\/\//i.test(href)
                const isPrimary = cta.variant === 'primary'
                const base =
                  'group inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm uppercase tracking-wider transition-all'
                const classes = isPrimary
                  ? `${base} bg-primary text-primary-foreground hover:brightness-110`
                  : `${base} border ${
                      hasMedia
                        ? 'border-white text-white hover:bg-white/10'
                        : 'border-primary-deep text-primary-deep hover:bg-primary/10'
                    }`

                const content = (
                  <>
                    {cta.label}
                    {isPrimary && (
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )

                if (isExternal) {
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes}
                    >
                      {content}
                    </a>
                  )
                }
                return (
                  <Link key={i} href={href} className={classes}>
                    {content}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  )
}
