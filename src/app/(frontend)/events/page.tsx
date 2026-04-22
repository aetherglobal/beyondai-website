import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function EventsPage() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryEventsPage()

  if (!page) {
    return <PayloadRedirects url="/events" />
  }

  const { hero, layout } = page

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url="/events" />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryEventsPage()
  return generateMeta({ doc: page })
}

const queryEventsPage = cache(
  async (): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: { equals: 'events' },
      },
    })

    return result.docs?.[0] || null
  },
)
