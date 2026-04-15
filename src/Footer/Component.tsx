import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { NewsletterForm } from '@/components/NewsletterForm'
import { SocialLinks } from '@/components/SocialLinks'

import type { SiteSetting } from '@/payload-types'

const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Articles', href: '/posts' },
]

const PROGRAMS_LINKS = [
  { label: 'Nyansa Futures', href: '/nyansa-futures' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Become a Sponsor', href: '/become-a-sponsor' },
]

const GET_INVOLVED_LINKS = [
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
]

export async function Footer() {
  const siteSettings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting

  return (
    <footer className="mt-auto border-t border-border bg-background text-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand + Social */}
          <div className="lg:col-span-2">
            <Link className="flex items-center mb-4" href="/">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">Beyond</span> AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {siteSettings?.siteDescription ||
                'A civic platform for AI governance and digital transformation in Africa.'}
            </p>
            <SocialLinks
              twitter={siteSettings?.socialLinks?.twitter}
              linkedin={siteSettings?.socialLinks?.linkedin}
              instagram={siteSettings?.socialLinks?.instagram}
              youtube={siteSettings?.socialLinks?.youtube}
              facebook={siteSettings?.socialLinks?.facebook}
              className="mt-4"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Programs
            </h3>
            <nav className="flex flex-col gap-2">
              {PROGRAMS_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <h3 className="font-semibold mb-4 mt-6 text-sm uppercase tracking-wider text-muted-foreground">
              Get Involved
            </h3>
            <nav className="flex flex-col gap-2">
              {GET_INVOLVED_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter + Contact */}
          <div id="footer-newsletter">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to AI Pulse</p>
            <NewsletterForm compact />

            <h3 className="font-semibold mb-4 mt-6 text-sm uppercase tracking-wider text-muted-foreground">
              Contact
            </h3>
            <div className="space-y-2 text-sm">
              {siteSettings?.contactEmail && (
                <p>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </p>
              )}
              {siteSettings?.contactPhone && (
                <p>
                  <a
                    href={`tel:${siteSettings.contactPhone}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {siteSettings.contactPhone}
                  </a>
                </p>
              )}
              {siteSettings?.address && (
                <p className="text-muted-foreground whitespace-pre-line">{siteSettings.address}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Beyond AI. All rights reserved.
          </p>
          <SocialLinks
            twitter={siteSettings?.socialLinks?.twitter}
            linkedin={siteSettings?.socialLinks?.linkedin}
            instagram={siteSettings?.socialLinks?.instagram}
            youtube={siteSettings?.socialLinks?.youtube}
            facebook={siteSettings?.socialLinks?.facebook}
          />
        </div>
      </div>
    </footer>
  )
}
