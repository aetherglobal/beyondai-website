import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getServerSideURL } from '@/utilities/getURL'
import { CACHE_TTL_SECONDS } from '@/blocks/_data/cache'

const STATIC_ROUTES = ['/search', '/posts', '/gallery', '/sponsors']

const COLLECTIONS = [
  { slug: 'pages', prefix: '' },
  { slug: 'posts', prefix: '/posts' },
  { slug: 'events', prefix: '/events' },
] as const

const getSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config })
    const siteUrl = getServerSideURL()
    const fallback = new Date().toISOString()

    const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: fallback,
    }))

    for (const { slug, prefix } of COLLECTIONS) {
      const { docs } = await payload.find({
        collection: slug,
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: { _status: { equals: 'published' } },
        select: { slug: true, updatedAt: true },
      })

      for (const doc of docs) {
        if (!doc.slug) continue
        entries.push({
          url: doc.slug === 'home' ? `${siteUrl}/` : `${siteUrl}${prefix}/${doc.slug}`,
          lastModified: doc.updatedAt || fallback,
        })
      }
    }

    return entries.filter(
      (entry, i, all) => all.findIndex((other) => other.url === entry.url) === i,
    )
  },
  ['sitemap'],
  {
    tags: ['pages-sitemap', 'posts-sitemap', 'events-sitemap'],
    revalidate: CACHE_TTL_SECONDS,
  },
)

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemap()
}
