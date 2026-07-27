import canUseDOM from './canUseDOM'

/**
 * Normalise an env-supplied origin into an absolute URL with no trailing slash.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is a bare hostname (`beyondai.africa`), and
 * `NEXT_PUBLIC_SERVER_URL` is sometimes configured the same way. Emitting either
 * one unprefixed produces protocol-less URLs, which are invalid in sitemaps and
 * robots.txt — search engines discard them.
 */
const normaliseOrigin = (value: string) => {
  const trimmed = value.trim().replace(/\/+$/, '')

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export const getServerSideURL = () => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

  return configured ? normaliseOrigin(configured) : 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  const configured = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_SERVER_URL

  return configured ? normaliseOrigin(configured) : ''
}
