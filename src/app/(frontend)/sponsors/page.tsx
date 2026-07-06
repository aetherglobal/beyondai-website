import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SponsorGrid } from '@/components/SponsorGrid'

import type { Sponsor } from '@/payload-types'

export default async function SponsorsPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'sponsors',
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })

  const allSponsors = result.docs as Sponsor[]

  const sponsors = allSponsors.filter((s) => s.type === 'sponsor')
  const collaborators = allSponsors.filter((s) => s.type === 'collaborator')
  const mediaPartners = allSponsors.filter((s) => s.type === 'media-partner')

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
          Sponsors & Partners
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl text-justify hyphens-auto">
          Beyond AI is made possible through the support of our sponsors and partners who share our
          commitment to responsible AI governance in Africa.
        </p>
      </section>

      {sponsors.length > 0 && (
        <section className="container py-8">
          <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-8">Sponsors</h2>
          <SponsorGrid sponsors={sponsors} />
        </section>
      )}

      {collaborators.length > 0 && (
        <section className="bg-card py-12">
          <div className="container">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-8">Collaborators</h2>
            <SponsorGrid sponsors={collaborators} />
          </div>
        </section>
      )}

      {mediaPartners.length > 0 && (
        <section className="container py-8">
          <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-8">Media Partners</h2>
          <SponsorGrid sponsors={mediaPartners} />
        </section>
      )}

      {allSponsors.length === 0 && (
        <section className="container py-8">
          <p className="text-muted-foreground">
            We are currently seeking sponsors and partners. Interested in supporting Beyond AI?
          </p>
        </section>
      )}

      <section className="container py-12 text-center">
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4">Interested in Partnering?</h2>
        <p className="text-muted-foreground mb-6 text-justify hyphens-auto">
          Support the Beyond AI initiative and help shape AI governance in Africa.
        </p>
        <Button asChild size="lg">
          <Link href="/become-a-sponsor">Become a Sponsor</Link>
        </Button>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Sponsors & Partners',
  description:
    'Meet the sponsors and partners supporting the Beyond AI initiative in advancing AI governance in Africa.',
}
