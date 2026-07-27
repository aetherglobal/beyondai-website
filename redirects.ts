import type { NextConfig } from 'next'

/**
 * Redirects for URLs from the WordPress site that beyondai.africa ran until April 2026.
 *
 * Those URLs are still in Google's index, so visitors arriving from search were landing
 * on 404s (reported for `/ambition`, which held what is now `/about`). Permanent
 * redirects consolidate the old URLs' ranking signals onto the current pages.
 *
 * The bar for an entry here is that a *genuine equivalent exists today* — not merely that
 * the old page was real. Redirecting to a page that does not serve the same need is read
 * as a soft 404: the ranking signal is discounted anyway and the visitor is left somewhere
 * they did not ask for. When there is no equivalent, a 404 is the honest answer.
 *
 * Deliberately NOT redirected — these were real Beyond AI pages, but nothing replaces them:
 *   - `/team`, `/faq` — `/about` carries neither a team section nor an FAQ (the FAQ blocks
 *     live on `/volunteer` and `/become-a-sponsor`, which answer different questions).
 *   - `/newsletter` — signup is a footer widget on every page, not a page of its own;
 *     pointing it at `/` would be a homepage redirect, the textbook soft-404 pattern.
 *   - `/ideas`, `/activities`, `/action` — no current page covers them.
 *   - The old theme's demo pages (`/buttons`, `/shop`, `/homepage-barber-shop`,
 *     `/testimonial/*`, `/area-item/*`, `/blog-pages/*`, …). These were never Beyond AI
 *     content; they should keep 404ing so they drop out of the index.
 */
const LEGACY_PATH_MAP: Record<string, string> = {
  // Old top-level nav
  '/ambition': '/about', // archived content is verbatim the current about page
  '/conference': '/nyansa-futures', // Nyansa Futures is the conference
  '/watch': '/posts', // old "AI Watch" section — editorial content now lives here
  '/updates': '/posts', // old "Updates" section — same
  '/sponsors-partners': '/become-a-sponsor', // old "Sponsors" nav item
  '/showcase': '/gallery', // old footer "Showcase" — event photography

  // Past-event pages, matched to the surviving event doc by date rather than sent to the
  // generic listing: /ai-for-whom-* -> the 2025-05-03 event, and the Accra workshop ->
  // the 2025-06-28 event.
  '/ai-for-whom-2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/ai-for-whom-may2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/workshop-in-accra-ghana-june-28th-2025':
    '/events/what-does-ai-have-to-do-with-the-price-of-kenkey',

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
