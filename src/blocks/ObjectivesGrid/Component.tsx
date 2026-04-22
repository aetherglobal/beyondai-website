import React from 'react'

import type { ObjectivesGridBlock as ObjectivesGridBlockType } from '@/payload-types'

type Props = ObjectivesGridBlockType & { disableInnerContainer?: boolean }

export const ObjectivesGridBlock: React.FC<Props> = ({ eyebrow, heading, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        {(eyebrow || heading) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1]">
                {heading}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-8 border border-border bg-secondary/30 hover:border-primary-deep transition-colors"
            >
              <p className="text-4xl md:text-5xl font-bold text-primary-deep mb-6">{item.number}</p>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
