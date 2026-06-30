import React from 'react'
import { Check } from 'lucide-react'

import type { SponsorshipTiersBlock as SponsorshipTiersBlockType } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = SponsorshipTiersBlockType & { disableInnerContainer?: boolean }

const backgroundClassMap: Record<string, string> = {
  primary: 'bg-primary',
  white: 'bg-white',
  secondary: 'bg-secondary',
  dark: 'bg-dark',
}

/** Tiny metal-tone signifier per named tier — the only per-tier colour. */
const tierDotColor: Record<string, string> = {
  platinum: '#C9CDD2',
  gold: '#C8A24B',
  silver: '#A8AEB4',
  bronze: '#B87333',
}

/** Split a "GHS 250,000+" amount into a currency prefix + the figure. */
function splitAmount(amount?: string | null): { prefix?: string; value?: string } {
  if (!amount) return {}
  const match = amount.trim().match(/^([A-Za-z]{2,4})\s+(.*)$/)
  if (match) return { prefix: match[1], value: match[2] }
  return { value: amount }
}

const FORM_HREF = '#sponsor-form'

export const SponsorshipTiersBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  background = 'white',
  tiers,
  footnote,
}) => {
  if (!tiers || tiers.length === 0) return null

  const bg = backgroundClassMap[background ?? 'white']
  const onColored = background === 'primary' || background === 'dark'

  const descriptionColor = onColored ? 'text-primary-foreground/70' : 'text-muted-foreground'
  const checkColor = onColored ? 'text-primary-foreground' : 'text-primary-deep'

  return (
    <section className={`mt-16 py-20 md:py-24 ${bg}`}>
      <div className="container">
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          onColored={onColored}
          className="mb-12 max-w-2xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => {
            const featured = Boolean(tier.highlighted)
            const dot = tierDotColor[(tier.name ?? '').toLowerCase()] ?? 'var(--primary-deep)'
            const { prefix, value } = splitAmount(tier.amount)

            const cardBorder = featured
              ? 'border-2 border-primary-deep shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]'
              : onColored
                ? 'border border-primary-foreground/15'
                : 'border border-border'
            const surface = onColored ? 'bg-primary-foreground/5' : 'bg-white'
            const headingColor = onColored ? 'text-primary-foreground' : 'text-foreground'

            return (
              <Reveal key={i} delay={i * 70} className="h-full">
                <div className={`relative flex h-full flex-col p-8 ${surface} ${cardBorder}`}>
                  {featured && (
                    <span className="absolute -top-3 left-8 bg-primary-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      Flagship
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: dot }}
                    />
                    <h3
                      className={`text-sm font-bold uppercase tracking-widest ${headingColor}`}
                    >
                      {tier.name}
                    </h3>
                  </div>

                  {(prefix || value) && (
                    <p className={`mt-5 flex items-baseline gap-1.5 ${headingColor}`}>
                      {prefix && (
                        <span className={`text-xs font-semibold uppercase tracking-widest ${descriptionColor}`}>
                          {prefix}
                        </span>
                      )}
                      {value && (
                        <span className="text-price font-bold tracking-tight tabular-nums">
                          {value}
                        </span>
                      )}
                    </p>
                  )}

                  <a
                    href={FORM_HREF}
                    className={`mt-6 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
                      featured
                        ? 'bg-primary text-primary-foreground hover:brightness-110'
                        : onColored
                          ? 'border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'
                          : 'border border-primary-deep text-primary-deep hover:bg-primary/10'
                    }`}
                  >
                    Talk to us
                  </a>

                  {tier.features && tier.features.length > 0 && (
                    <ul
                      className={`mt-7 space-y-3.5 border-t pt-7 ${
                        onColored ? 'border-primary-foreground/15' : 'border-border'
                      }`}
                    >
                      {tier.features.map((f, j) => (
                        <li
                          key={j}
                          className={`flex items-start gap-2.5 text-sm leading-relaxed ${descriptionColor}`}
                        >
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} aria-hidden="true" />
                          <span>{f.feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>

        {footnote && (
          <Reveal delay={100}>
            <div className={`mt-10 max-w-3xl text-sm leading-relaxed ${descriptionColor}`}>
              <p>{footnote}</p>
              <a
                href={FORM_HREF}
                className={`mt-3 inline-flex items-center gap-1.5 font-medium ${
                  onColored ? 'text-primary-foreground' : 'text-primary-deep'
                } hover:underline underline-offset-4`}
              >
                Need a custom package? Talk to us
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
