import type { NextConfig } from 'next'

// Add an entry only when a genuine equivalent exists today; otherwise prefer a 404. A
// redirect to a page that does not serve the same need reads as a soft 404.
const LEGACY_PATH_MAP: Record<string, string> = {
  '/ambition': '/about',
  '/conference': '/nyansa-futures',
  '/watch': '/posts',
  '/updates': '/posts',
  '/sponsors-partners': '/become-a-sponsor',
  '/showcase': '/gallery',
  '/ai-for-whom-2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/ai-for-whom-may2025': '/events/ai-for-whom-innovation-or-unemployment',
  '/workshop-in-accra-ghana-june-28th-2025':
    '/events/what-does-ai-have-to-do-with-the-price-of-kenkey',
  '/ai-digital-colonialism-social-mobilization-in-africa':
    '/posts/ai-digital-colonialism-social-mobilization-in-africa',
  '/home': '/',
}

export const redirects: NextConfig['redirects'] = async () =>
  Object.entries(LEGACY_PATH_MAP).map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }))
