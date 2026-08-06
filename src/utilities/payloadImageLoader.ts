import type { ImageLoader } from 'next/image'

import type { Media } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'

const SCALED_SIZES = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

type Variant = { url: string; width: number }

const toRequestUrl = (url: string): string => {
  try {
    return new URL(url).toString()
  } catch {
    return encodeURI(url)
  }
}

const getVariants = (resource: Media): Variant[] => {
  const variants: Variant[] = []

  for (const name of SCALED_SIZES) {
    const size = resource.sizes?.[name]
    if (size?.url && size.width) variants.push({ url: size.url, width: size.width })
  }

  if (resource.url && resource.width) variants.push({ url: resource.url, width: resource.width })

  return variants.sort((a, b) => a.width - b.width)
}

export const buildMediaLoader = (resource: Media): ImageLoader | undefined => {
  const variants = getVariants(resource)
  if (variants.length === 0) return undefined

  return ({ src, width }) => {
    const match = variants.find((variant) => variant.width >= width) ?? variants.at(-1)
    return match ? getMediaUrl(toRequestUrl(match.url), resource.updatedAt) : src
  }
}
