// CommonJS postbuild step, so it can't import `normaliseOrigin` from src/utilities/getURL.ts
// — the scheme handling below duplicates it deliberately. Keep the two in sync.
const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

if (!configured) {
  console.warn(
    'next-sitemap: NEXT_PUBLIC_SERVER_URL is unset, falling back to http://localhost:3000. Set it for any deployed build.',
  )
}

const trimmed = (configured || 'http://localhost:3000').trim().replace(/\/+$/, '')
const SITE_URL = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/events-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/events-sitemap.xml`,
    ],
  },
}
