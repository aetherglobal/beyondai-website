import React from 'react'

import type { FAQBlockType as FAQBlockData } from '@/payload-types'
import RichText from '@/components/RichText'

type Props = FAQBlockData & { disableInnerContainer?: boolean }

export const FAQBlockComponent: React.FC<Props> = ({ eyebrow, heading, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        {(eyebrow || heading) && (
          <div className="mb-10 max-w-2xl">
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

        <div className="max-w-3xl divide-y divide-border border-y border-border">
          {items.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold pr-4">{item.question}</span>
                <span className="text-2xl text-primary-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed">
                <RichText data={item.answer} enableGutter={false} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
