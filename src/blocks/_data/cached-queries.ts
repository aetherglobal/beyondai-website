import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Event, GalleryImage, Post, Sponsor } from '@/payload-types'

const DEFAULT_LIMIT = 3

// Backstop TTL for the persistent Data Cache. Content changes still refresh
// immediately via revalidateTag(...) in each collection's hooks; this ensures a
// missed tag revalidation (e.g. a DB/infra swap, or a direct DB write) self-heals
// within the hour instead of freezing indefinitely. It also keeps the date-based
// event queries below from caching a stale "now".
const CACHE_TTL_SECONDS = 3600

export const getUpcomingEvents = cache(async (limit: number = DEFAULT_LIMIT): Promise<Event[]> => {
  const fetcher = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'events',
        where: {
          date: { greater_than_equal: new Date().toISOString() },
          eventStatus: { not_equals: 'cancelled' },
          _status: { equals: 'published' },
        },
        sort: 'date',
        limit,
        depth: 1,
      })
      return result.docs as Event[]
    },
    ['upcoming-events', String(limit)],
    { tags: ['events'], revalidate: CACHE_TTL_SECONDS },
  )
  return fetcher()
})

export const getPastEvents = cache(async (limit: number = 20): Promise<Event[]> => {
  const fetcher = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'events',
        where: {
          date: { less_than: new Date().toISOString() },
          eventStatus: { not_equals: 'cancelled' },
          _status: { equals: 'published' },
        },
        sort: '-date',
        limit,
        depth: 1,
      })
      return result.docs as Event[]
    },
    ['past-events', String(limit)],
    { tags: ['events'], revalidate: CACHE_TTL_SECONDS },
  )
  return fetcher()
})

export const getLatestPosts = cache(async (limit: number = DEFAULT_LIMIT): Promise<Post[]> => {
  const fetcher = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit,
        depth: 1,
      })
      return result.docs as Post[]
    },
    ['latest-posts', String(limit)],
    { tags: ['posts'], revalidate: CACHE_TTL_SECONDS },
  )
  return fetcher()
})

export const getFeaturedSponsors = cache(
  async (limit: number = 10, featuredOnly = true): Promise<Sponsor[]> => {
    const fetcher = unstable_cache(
      async () => {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.find({
          collection: 'sponsors',
          where: featuredOnly ? { featured: { equals: true } } : {},
          sort: 'sortOrder',
          limit,
          depth: 1,
        })
        return result.docs as Sponsor[]
      },
      ['featured-sponsors', String(limit), String(featuredOnly)],
      { tags: ['sponsors'], revalidate: CACHE_TTL_SECONDS },
    )
    return fetcher()
  },
)

export const getGalleryImages = cache(async (limit: number = 100): Promise<GalleryImage[]> => {
  const fetcher = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'gallery-images',
        sort: 'sortOrder',
        limit,
        depth: 2,
      })
      return result.docs as GalleryImage[]
    },
    ['gallery-images', String(limit)],
    { tags: ['gallery-images'], revalidate: CACHE_TTL_SECONDS },
  )
  return fetcher()
})
