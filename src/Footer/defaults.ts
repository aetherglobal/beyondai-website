export type FooterColumnFallback = {
  heading: string
  links: { label: string; href: string; newTab?: boolean }[]
}

export const DEFAULT_FOOTER_COLUMNS: FooterColumnFallback[] = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Events', href: '/events' },
      { label: 'Articles', href: '/posts' },
    ],
  },
  {
    heading: 'Programs',
    links: [
      { label: 'Nyansa Futures', href: '/nyansa-futures' },
      { label: 'Sponsors', href: '/sponsors' },
      { label: 'Become a Sponsor', href: '/become-a-sponsor' },
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]
