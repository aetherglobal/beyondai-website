import React from 'react'

import type { FeaturedSponsorsBlockType } from '@/payload-types'
import { SponsorGrid } from '@/components/SponsorGrid'
import { getFeaturedSponsors } from '@/blocks/_data/cached-queries'

type Props = FeaturedSponsorsBlockType & { disableInnerContainer?: boolean }

export const FeaturedSponsorsBlockComponent: React.FC<Props> = async ({
  heading,
  limit,
  featuredOnly,
}) => {
  const sponsors = await getFeaturedSponsors(limit ?? 10, featuredOnly ?? true)
  if (sponsors.length === 0) return null

  return (
    <section className="bg-secondary">
      <div className="container py-20">
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground text-center mb-12">
            {heading}
          </h2>
        )}
        <SponsorGrid
          sponsors={sponsors}
          className="border-foreground/20 [&>div]:border-foreground/20"
        />
      </div>
    </section>
  )
}
