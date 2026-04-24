export type NavFallbackItem = { label: string; href: string; newTab?: boolean }

export const DEFAULT_HEADER_NAV_ITEMS: NavFallbackItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Nyansa Futures', href: '/nyansa-futures' },
  { label: 'Articles', href: '/posts' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
]

export const DEFAULT_HEADER_CTA: { label: string; href: string } = {
  label: 'Register Now',
  href: '/events',
}
