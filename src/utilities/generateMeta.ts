import type { Metadata } from 'next'

import type { Event, Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image) {
    const serverUrl = getServerSideURL()
    const ogUrl = image.sizes?.og?.url

    return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return undefined
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Event> | null
  // Per-doc defaults used when the SEO tab is empty (e.g. an event's own
  // title/date/imagery). The doc's `meta.*` fields always take precedence.
  fallback?: {
    title?: string | null
    description?: string | null
    image?: Media | Config['db']['defaultIDType'] | null
  }
}): Promise<Metadata> => {
  const { doc, fallback } = args

  const ogImage = getImageURL(doc?.meta?.image) ?? getImageURL(fallback?.image)

  // Let the root layout supply the site title/template (`%s — Beyond AI`).
  const title = doc?.meta?.title || fallback?.title || undefined
  const description = doc?.meta?.description || fallback?.description || undefined

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
