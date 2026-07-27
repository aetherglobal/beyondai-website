import type { NextConfig } from 'next'

/**
 * URLs from the WordPress site beyondai.africa ran until April 2026, still in Google's index.
 *
 * An entry belongs here only if a genuine equivalent exists today. Redirecting to a page
 * that does not serve the same need reads as a soft 404 — the ranking signal is discounted
 * and the visitor lands somewhere they did not ask for. With no equivalent, prefer a 404.
 * That is why `/team`, `/faq`, `/newsletter`, `/ideas`, `/activities` and `/action` are
 * absent, along with the old theme's demo pages (`/buttons`, `/shop`, `/testimonial/*`, …).
 */
const LEGACY_PATH_MAP: Record<string, string> = {
  '/ambition': '/about',
  '/conference': '/nyansa-futures',
  '/watch': '/posts',
  '/updates': '/posts',
  '/sponsors-partners': '/become-a-sponsor',
  '/showcase': '/gallery',

  // Matched to the surviving event by date rather than sent to the generic listing.
  '/ai-for-whom-2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/ai-for-whom-may2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/workshop-in-accra-ghana-june-28th-2025':
    '/events/what-does-ai-have-to-do-with-the-price-of-kenkey',

  '/ai-digital-colonialism-social-mobilization-in-africa':
    '/posts/ai-digital-colonialism-social-mobilization-in-africa',

  // Not legacy: `/` and `/home` both render the `home` doc, duplicating the homepage.
  '/home': '/',
}

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  const legacyRedirects = Object.entries(LEGACY_PATH_MAP).map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }))

  // `internetExplorerRedirect` matches every path, so it must stay last.
  return [...legacyRedirects, internetExplorerRedirect]
}
