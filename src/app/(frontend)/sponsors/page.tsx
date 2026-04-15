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
  const knowledgePartners = allSponsors.filter((s) => s.type === 'knowledge-partner')
  const communityPartners = allSponsors.filter((s) => s.type === 'community-partner')

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Sponsors & Partners
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Beyond AI is made possible through the support of our sponsors and partners who share our
          commitment to responsible AI governance in Africa.
        </p>
      </section>

      {sponsors.length > 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-semibold mb-8">Sponsors</h2>
          <SponsorGrid sponsors={sponsors} />
        </section>
      )}

      {knowledgePartners.length > 0 && (
        <section className="bg-card py-12">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-8">Knowledge Partners</h2>
            <SponsorGrid sponsors={knowledgePartners} />
          </div>
        </section>
      )}

      {communityPartners.length > 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-semibold mb-8">Community Partners</h2>
          <SponsorGrid sponsors={communityPartners} />
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
        <h2 className="text-2xl font-semibold mb-4">Interested in Partnering?</h2>
        <p className="text-muted-foreground mb-6">
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
  title: 'Sponsors & Partners — Beyond AI',
  description:
    'Meet the sponsors and partners supporting the Beyond AI initiative in advancing AI governance in Africa.',
}
