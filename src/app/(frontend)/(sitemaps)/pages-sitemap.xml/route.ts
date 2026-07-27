import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'

/**
 * Routes that exist as hardcoded React pages rather than Pages-collection docs,
 * so they never appear in the query below and have to be listed explicitly.
 */
const STATIC_ROUTES = ['/search', '/posts', '/gallery', '/sponsors']

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap = STATIC_ROUTES.map((route) => ({
      loc: `${SITE_URL}${route}`,
      lastmod: dateFallback,
    }))

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    // A Pages doc can share a slug with a hardcoded route (e.g. `posts`), which would
    // otherwise emit the same <loc> twice. Docs come first so their real `updatedAt`
    // wins over the static entry's fallback timestamp.
    return [...sitemap, ...defaultSitemap].filter(
      (entry, index, all) => all.findIndex((other) => other.loc === entry.loc) === index,
    )
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
