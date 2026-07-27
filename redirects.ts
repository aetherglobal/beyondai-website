import type { NextConfig } from 'next'

/**
 * Redirects for URLs from the WordPress site that beyondai.africa ran until April 2026.
 *
 * Those URLs are still in Google's index, so visitors arriving from search were landing
 * on 404s (reported for `/ambition`, which held what is now `/about`). Permanent
 * redirects consolidate the old URLs' ranking signals onto the current pages.
 *
 * Deliberately NOT redirected:
 *   - `/action` — the old "Call to action" page has no clear modern equivalent.
 *   - The old theme's demo pages (`/buttons`, `/shop`, `/homepage-barber-shop`,
 *     `/testimonial/*`, `/area-item/*`, `/blog-pages/*`, …). These were never Beyond AI
 *     content; they should keep 404ing so they drop out of the index.
 */
const LEGACY_PATH_MAP: Record<string, string> = {
  // Old top-level nav
  '/ambition': '/about', // archived content is verbatim the current about page
  '/conference': '/nyansa-futures', // Nyansa Futures is the conference
  '/watch': '/posts', // old "AI Watch" section
  '/updates': '/posts', // old "Updates" section
  '/sponsors-partners': '/become-a-sponsor', // old "Sponsors" nav item
  '/showcase': '/gallery', // old footer "Showcase"

  // Other real content pages
  '/team': '/about',
  '/faq': '/about',
  '/ideas': '/posts',
  '/activities': '/events',
  '/newsletter': '/', // signup lives in the footer

  // Past-event pages
  '/ai-for-whom-2025': '/events',
  '/ai-for-whom-may2025': '/events',
  '/workshop-in-accra-ghana-june-28th-2025': '/events',

  // WordPress served posts at the root; this slug exists as a post today
  '/ai-digital-colonialism-social-mobilization-in-africa':
    '/posts/ai-digital-colonialism-social-mobilization-in-africa',

  // Not a legacy URL but a live duplicate: `/` and `/home` both render the `home`
  // Pages doc, serving identical content at two URLs.
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

  // Legacy redirects first: `internetExplorerRedirect` matches every path, so it has to
  // stay last or it would shadow them for IE user agents.
  return [...legacyRedirects, internetExplorerRedirect]
}
