import React from 'react'

import type { StatsRowBlock as StatsRowBlockType } from '@/payload-types'

type Props = StatsRowBlockType & { disableInnerContainer?: boolean }

export const StatsRowBlock: React.FC<Props> = ({ heading, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-white">
      <div className="container py-16">
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-10 max-w-2xl">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-8">
          {items.map((item, i) => (
            <div key={i}>
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-deep mb-2">{item.number}</p>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
