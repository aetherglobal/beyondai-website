import React from 'react'

import type { ObjectivesGridBlock as ObjectivesGridBlockType } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = ObjectivesGridBlockType & { disableInnerContainer?: boolean }

export const ObjectivesGridBlock: React.FC<Props> = ({ eyebrow, heading, items }) => {
  if (!items || items.length === 0) return null

  const lgCols = items.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-24">
        <SectionHeader eyebrow={eyebrow} heading={heading} className="mb-12 max-w-3xl" />

        <div className={`grid grid-cols-1 md:grid-cols-2 ${lgCols} gap-6`}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 70} className="h-full">
              <div className="group flex h-full flex-col border border-border bg-secondary/30 p-8 transition-colors hover:border-primary-deep">
                <p className="text-5xl md:text-6xl font-bold leading-none text-primary-deep/25 tabular-nums transition-colors group-hover:text-primary-deep/40">
                  {item.number}
                </p>
                <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
