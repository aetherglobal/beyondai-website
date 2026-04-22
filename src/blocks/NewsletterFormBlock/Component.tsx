import React from 'react'

import type { NewsletterFormBlockType } from '@/payload-types'
import { NewsletterForm } from '@/components/NewsletterForm'

type Props = NewsletterFormBlockType & { disableInnerContainer?: boolean }

export const NewsletterFormBlockComponent: React.FC<Props> = ({
  heading,
  subheading,
  variant = 'full',
}) => {
  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        <div className="max-w-2xl">
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-4">{heading}</h2>
          )}
          {subheading && <p className="text-muted-foreground leading-relaxed mb-8">{subheading}</p>}
          <NewsletterForm compact={variant === 'compact'} />
        </div>
      </div>
    </section>
  )
}
