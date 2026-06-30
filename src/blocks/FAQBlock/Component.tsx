import React from 'react'
import { ChevronDown } from 'lucide-react'

import type { FAQBlockType as FAQBlockData } from '@/payload-types'
import RichText from '@/components/RichText'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = FAQBlockData & { disableInnerContainer?: boolean }

export const FAQBlockComponent: React.FC<Props> = ({ eyebrow, heading, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-24">
        <SectionHeader eyebrow={eyebrow} heading={heading} className="mb-10 max-w-2xl" />

        <Reveal>
          <div className="max-w-3xl divide-y divide-border border-y border-border">
            {items.map((item, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary-deep">
                    {item.question}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-primary-deep transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-4 text-muted-foreground leading-relaxed group-open:animate-in group-open:fade-in group-open:slide-in-from-top-1 group-open:duration-300">
                  <RichText data={item.answer} enableGutter={false} />
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
