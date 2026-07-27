import type { Metadata } from 'next'

import type { Event, Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const SITE_NAME = 'Beyond AI'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image) {
    const serverUrl = getServerSideURL()
    const ogUrl = image.sizes?.og?.url

    return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return undefined
}

export const buildTitle = (value?: string | null): string | undefined => {
  const core = (value || '')
    .replace(new RegExp(`\\s*[|\\-–—:]\\s*${SITE_NAME}\\s*$`, 'i'), '')
    .trim()

  if (!core || core.toLowerCase() === SITE_NAME.toLowerCase()) return undefined

  return /^beyond ai\b/i.test(core) ? core : `${SITE_NAME} | ${core}`
}

export const resolveCanonicalPath = (path?: string | null): string => {
  if (!path || path === '/') return '/'

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`

  return withLeadingSlash.replace(/\/+$/, '') || '/'
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Event> | null
  fallback?: {
    title?: string | null
    description?: string | null
    image?: Media | Config['db']['defaultIDType'] | null
  }
  /** Must be passed: a doc's slug alone does not imply its URL, as posts and events nest. */
  path?: string | null
}): Promise<Metadata> => {
  const { doc, fallback, path } = args

  const ogImage = getImageURL(doc?.meta?.image) ?? getImageURL(fallback?.image)

  const title = buildTitle(doc?.meta?.title || fallback?.title)
  const description = doc?.meta?.description || fallback?.description || undefined
  const canonical = resolveCanonicalPath(path)

  return {
    alternates: {
      canonical,
    },
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
      url: canonical,
    }),
    title: title ? { absolute: title } : undefined,
  }
}
