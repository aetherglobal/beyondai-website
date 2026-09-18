import 'server-only'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Event, GalleryImage, Post, Sponsor } from '@/payload-types'
import { CACHE_TTL_SECONDS } from './cache'

const findCached = <T>(
  key: string[],
  tag: string,
  args: Parameters<Payload['find']>[0],
): Promise<T[]> =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find(args)
      return docs as T[]
    },
    key,
    { tags: [tag], revalidate: CACHE_TTL_SECONDS },
  )()

const published = { _status: { equals: 'published' } }

export const getUpcomingEvents = cache((limit: number = 3) =>
  findCached<Event>(['upcoming-events', String(limit)], 'events', {
    collection: 'events',
    where: {
      date: { greater_than_equal: new Date().toISOString() },
      eventStatus: { not_equals: 'cancelled' },
      ...published,
    },
    sort: 'date',
    limit,
    depth: 1,
  }),
)

export const getPastEvents = cache((limit: number = 20) =>
  findCached<Event>(['past-events', String(limit)], 'events', {
    collection: 'events',
    where: {
      date: { less_than: new Date().toISOString() },
      eventStatus: { not_equals: 'cancelled' },
      ...published,
    },
    sort: '-date',
    limit,
    depth: 1,
  }),
)

export const getLatestPosts = cache((limit: number = 3) =>
  findCached<Post>(['latest-posts', String(limit)], 'posts', {
    collection: 'posts',
    where: published,
    sort: '-publishedAt',
    limit,
    depth: 1,
  }),
)

export const getFeaturedSponsors = cache((limit: number = 10, featuredOnly = true) =>
  findCached<Sponsor>(['featured-sponsors', String(limit), String(featuredOnly)], 'sponsors', {
    collection: 'sponsors',
    where: featuredOnly ? { featured: { equals: true } } : {},
    sort: 'sortOrder',
    limit,
    depth: 1,
  }),
)

export const getGalleryImages = cache((limit: number = 100) =>
  findCached<GalleryImage>(['gallery-images', String(limit)], 'gallery-images', {
    collection: 'gallery-images',
    sort: 'sortOrder',
    limit,
    depth: 2,
  }),
)
