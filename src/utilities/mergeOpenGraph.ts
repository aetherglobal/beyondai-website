import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

export const DEFAULT_OG_IMAGE = {
  url: `${getServerSideURL()}/og-default.png`,
  width: 1200,
  height: 630,
  alt: 'Beyond AI — AI Governance & Digital Transformation in Africa',
}

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa.',
  images: [DEFAULT_OG_IMAGE],
  siteName: 'Beyond AI',
  title: 'Beyond AI | AI Governance & Digital Transformation in Africa',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ?? defaultOpenGraph?.images,
  }
}
