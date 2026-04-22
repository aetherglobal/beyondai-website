import React from 'react'

import type { TimelineStepsBlock as TimelineStepsBlockType } from '@/payload-types'

type Props = TimelineStepsBlockType & { disableInnerContainer?: boolean }

export const TimelineStepsBlock: React.FC<Props> = ({ eyebrow, heading, steps }) => {
  if (!steps || steps.length === 0) return null

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

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <li key={i} className="border-t-2 border-primary-deep pt-4">
              <p className="text-sm font-mono text-primary-deep mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-bold mb-2 tracking-tight">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
