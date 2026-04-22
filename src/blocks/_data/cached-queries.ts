import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Event, Post, Sponsor } from '@/payload-types'

const DEFAULT_LIMIT = 3

export const getUpcomingEvents = cache(async (limit: number = DEFAULT_LIMIT): Promise<Event[]> => {
  const fetcher = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'events',
        where: {
          eventStatus: { equals: 'upcoming' },
          _status: { equals: 'published' },
        },
        sort: 'date',
        limit,
        depth: 1,
      })
      return result.docs as Event[]
    },
    ['upcoming-events', String(limit)],
    { tags: ['events'] },
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
          eventStatus: { equals: 'past' },
          _status: { equals: 'published' },
        },
        sort: '-date',
        limit,
        depth: 1,
      })
      return result.docs as Event[]
    },
    ['past-events', String(limit)],
    { tags: ['events'] },
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
    { tags: ['posts'] },
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
      { tags: ['sponsors'] },
    )
    return fetcher()
  },
)
