import React from 'react'

import type { VolunteerFormBlockType } from '@/payload-types'
import { VolunteerForm } from '@/components/VolunteerForm'

type Props = VolunteerFormBlockType & { disableInnerContainer?: boolean }

export const VolunteerFormBlockComponent: React.FC<Props> = ({ eyebrow, heading, subheading }) => {
  return (
    <section className="bg-secondary">
      <div className="container py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          {eyebrow && (
            <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-4">
              {heading}
            </h2>
          )}
          {subheading && <p className="text-muted-foreground leading-relaxed">{subheading}</p>}
        </div>
        <VolunteerForm />
      </div>
    </section>
  )
}
