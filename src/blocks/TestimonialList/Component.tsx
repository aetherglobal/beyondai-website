import React from 'react'

import type { TestimonialListBlock as TestimonialListBlockType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = TestimonialListBlockType & { disableInnerContainer?: boolean }

export const TestimonialListBlock: React.FC<Props> = ({ eyebrow, heading, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-secondary">
      <div className="container py-16 md:py-20">
        {(eyebrow || heading) && (
          <div className="mb-12 max-w-2xl">
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
            <figure key={i} className="bg-white p-8 border border-border">
              <blockquote className="text-lg leading-relaxed mb-6">“{item.quote}”</blockquote>
              <figcaption className="flex items-center gap-3">
                {item.avatar && typeof item.avatar !== 'number' && (
                  <div className="w-10 h-10 relative overflow-hidden rounded-full shrink-0">
                    <Media resource={item.avatar} fill imgClassName="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.author}</p>
                  {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
