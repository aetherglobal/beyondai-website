import Link from 'next/link'
import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'

/**
 * The site was migrated off WordPress in April 2026 and a few hundred old URLs are still
 * indexed — including ~174 pages of the previous theme's demo content that were never
 * Beyond AI's. Those URLs correctly 404, so this page is where a steady trickle of real
 * visitors from search lands. It needs to offer a way onward rather than a dead end.
 *
 * A plain GET form to /search is used rather than the client-side `Search` component: it
 * keeps this a server component, works without hydration, and navigates only on submit
 * (the client one pushes a new route on every keystroke).
 */

const DESTINATIONS: { href: string; label: string; description: string }[] = [
  {
    href: '/about',
    label: 'About Beyond AI',
    description: 'What the initiative is, why it exists, and what it aims to achieve.',
  },
  {
    href: '/nyansa-futures',
    label: 'Nyansa Futures',
    description: 'The flagship conference on AI governance in Africa.',
  },
  {
    href: '/events',
    label: 'Events',
    description: 'Upcoming and past convenings, panels, and workshops.',
  },
  {
    href: '/posts',
    label: 'Articles',
    description: 'Commentary and research on AI policy and digital sovereignty.',
  },
]

const WAYS_IN: { href: string; label: string }[] = [
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/become-a-sponsor', label: 'Sponsor or partner' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact us' },
]

export default function NotFound() {
  return (
    <div className="container py-20 md:py-28">
      <Reveal className="max-w-3xl">
        <SectionHeader
          as="h1"
          eyebrow="[404]"
          heading="We Couldn't Find"
          headingAccent="That Page"
          subheading="The link may be out of date. Beyond AI moved to a new website in 2026, so older addresses — and pages left over from the previous site's template — no longer exist. Try a search, or pick up from one of the main sections below."
        />
      </Reveal>

      <Reveal delay={80} className="mt-10 max-w-xl">
        <form action="/search" method="get" role="search">
          <label htmlFor="notfound-search" className="sr-only">
            Search the site
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="notfound-search"
                name="q"
                type="search"
                placeholder="Search articles and events…"
                className="h-12 w-full border border-input bg-background pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary-deep"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 shrink-0">
              Search
            </Button>
          </div>
        </form>
      </Reveal>

      <Reveal delay={160} className="mt-14">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest text-primary-deep">
          [Main sections]
        </h2>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {DESTINATIONS.map((item) => (
            <li key={item.href} className="bg-background">
              <Link
                href={item.href}
                className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-accent"
              >
                <span className="font-bold uppercase tracking-tight transition-colors group-hover:text-primary-deep">
                  {item.label}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={240} className="mt-12">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-primary-deep">
          [Get involved]
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {WAYS_IN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm underline underline-offset-4 transition-colors hover:text-primary-deep"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal delay={320} className="mt-14">
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to homepage</Link>
        </Button>
      </Reveal>
    </div>
  )
}
