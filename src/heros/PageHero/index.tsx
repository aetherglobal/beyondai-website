import React from 'react'
import Link from 'next/link'

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
    <section className="relative min-h-[70vh] bg-dark flex items-center overflow-hidden">
      {hasMedia ? (
        <div className="absolute inset-0">
          <Media resource={media} fill imgClassName="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(82% 0.17 85 / 0.1) 0%, transparent 70%)',
          }}
        />
      )}

      <div className="container relative z-10 py-20 md:py-28">
        {eyebrow && (
          <p className={`text-sm tracking-widest uppercase mb-6 font-mono ${hasMedia ? 'text-white/80' : 'text-primary-deep'}`}>
            {eyebrow}
          </p>
        )}

        {(headingLines.length > 0 || headingAccent) && (
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1] mb-8 ${hasMedia ? 'text-white' : 'text-foreground'}`}>
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {(i < headingLines.length - 1 || headingAccent) && <br />}
              </React.Fragment>
            ))}
            {headingAccent && <span className={hasMedia ? 'text-primary' : 'text-primary-deep'}>{headingAccent}</span>}
          </h1>
        )}

        {subtitle && (
          <p className={`text-lg max-w-2xl mb-10 leading-relaxed ${hasMedia ? 'text-white/85' : 'text-foreground/80'}`}>{subtitle}</p>
        )}

        {Array.isArray(ctas) && ctas.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {ctas.map((cta, i) => {
              const href = cta.href || '#'
              const isExternal = /^https?:\/\//i.test(href)
              const classes =
                cta.variant === 'primary'
                  ? 'inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all'
                  : `inline-flex items-center px-7 py-3.5 border font-semibold text-sm uppercase tracking-wider transition-all ${hasMedia ? 'border-white text-white hover:bg-white/10' : 'border-primary-deep text-primary-deep hover:bg-primary/10'}`

              if (isExternal) {
                return (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                  >
                    {cta.label}
                  </a>
                )
              }
              return (
                <Link key={i} href={href} className={classes}>
                  {cta.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  )
}
