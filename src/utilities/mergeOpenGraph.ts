import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa.',
  siteName: 'Beyond AI',
  title: 'Beyond AI | AI Governance & Digital Transformation in Africa',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
  }
}
