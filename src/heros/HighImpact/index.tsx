'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const hasMedia = media && typeof media === 'object'

  return (
    <section className="relative bg-dark text-white min-h-[60vh] flex items-center justify-center overflow-hidden">
      {hasMedia && (
        <div className="absolute inset-0 select-none">
          <Media fill imgClassName="object-cover" priority resource={media} />
          <div className="absolute inset-0 bg-dark/60" />
        </div>
      )}

      <div className="container relative z-10 py-20 md:py-28 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center flex-wrap gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
