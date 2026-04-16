import React from 'react'
import { Media } from '@/components/Media'

import type { Sponsor } from '@/payload-types'

export const SponsorGrid: React.FC<{
  sponsors: Sponsor[]
  className?: string
}> = ({ sponsors, className }) => {
  if (!sponsors.length) return null

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border border-white/15 ${className || ''}`}
    >
      {sponsors.map((sponsor) => {
        const logo = typeof sponsor.logo !== 'number' ? sponsor.logo : null
        if (!logo) return null

        const inner = (
          <Media
            resource={logo}
            className="flex items-center justify-center"
            imgClassName="max-h-20 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        )

        return (
          <div
            key={sponsor.id}
            className="flex items-center justify-center border border-white/15 px-6 py-8"
            title={sponsor.name}
          >
            {sponsor.url ? (
              <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              inner
            )}
          </div>
        )
      })}
    </div>
  )
}
