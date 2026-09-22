import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/admin/*', '/api/*', '/next/*'],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
