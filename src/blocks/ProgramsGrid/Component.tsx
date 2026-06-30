import React from 'react'
import Link from 'next/link'

import type { ProgramsGridBlock as ProgramsGridBlockType } from '@/payload-types'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = ProgramsGridBlockType & { disableInnerContainer?: boolean }

const columnClassMap: Record<string, string> = {
  '1': 'md:grid-cols-1',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

const backgroundClassMap: Record<string, string> = {
  primary: 'bg-primary',
  white: 'bg-white',
  secondary: 'bg-secondary',
  dark: 'bg-dark',
}

export const ProgramsGridBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  columns = '2',
  background = 'primary',
  items,
}) => {
  if (!items || items.length === 0) return null

  const bg = backgroundClassMap[background ?? 'primary']
  const isPrimary = background === 'primary'
  const isDark = background === 'dark'
  const onColored = isPrimary || isDark

  const cardBase = onColored
    ? 'bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10'
    : 'bg-white border-l-2 border-transparent hover:border-primary-deep hover:bg-secondary'
  const gridDivider = onColored ? 'bg-primary-foreground/10' : 'bg-border'
  const headingColor = onColored ? 'text-primary-foreground' : 'text-foreground'
  const descriptionColor = onColored ? 'text-primary-foreground/70' : 'text-muted-foreground'

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
        <div className={`grid grid-cols-1 ${columnClassMap[columns ?? '2']} gap-px ${gridDivider}`}>
          {items.map((item, i) => {
            const href = item.link ? resolveLinkHref(item.link) : null
            const hasHref = href && href !== '#'
            const inner = (
              <div
                className={`group relative h-full p-8 transition-colors duration-300 ${cardBase}`}
              >
                <h3 className={`text-xl font-bold mb-3 tracking-tight ${headingColor}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${descriptionColor}`}>{item.description}</p>
                {hasHref && (
                  <div
                    className={`mt-5 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${headingColor}`}
                  >
                    <span>Learn more</span>
                    <span aria-hidden="true">→</span>
                  </div>
                )}
              </div>
            )
            return (
              <Reveal key={i} delay={i * 60} className="h-full">
                {hasHref ? (
                  <Link href={href} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
