import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import Link from 'next/link'
import React from 'react'

import { NewsletterForm } from '@/components/NewsletterForm'
import { SiteLogo } from '@/components/SiteLogo'
import { SocialLinks } from '@/components/SocialLinks'

import type { Footer as FooterGlobal, SiteSetting } from '@/payload-types'
import { DEFAULT_FOOTER_COLUMNS } from './defaults'

export async function Footer() {
  const [siteSettings, footerData] = await Promise.all([
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting | null>,
    getCachedGlobal('footer', 1)() as Promise<FooterGlobal | null>,
  ])

  const columnsFromCMS = (footerData?.linkColumns ?? []).map((col) => ({
    heading: col.heading,
    links: (col.links ?? []).map((item) => ({
      label: item.link?.label ?? '',
      href: resolveLinkHref(item.link),
      newTab: item.link?.newTab ?? false,
    })),
  }))
  const columns =
    columnsFromCMS.length > 0
      ? columnsFromCMS
      : DEFAULT_FOOTER_COLUMNS.map((c) => ({
          heading: c.heading,
          links: c.links.map((l) => ({ label: l.label, href: l.href, newTab: l.newTab ?? false })),
        }))

  const newsletterHeading = footerData?.newsletter?.heading || 'Newsletter'
  const newsletterSubheading = footerData?.newsletter?.subheading || 'Subscribe to AI Pulse'

  const copyrightTemplate =
    footerData?.copyrightText || '© {year} Beyond AI. All rights reserved.'
  const copyright = copyrightTemplate.replace('{year}', String(new Date().getFullYear()))

  const branding = siteSettings?.branding
  const logoDark = branding?.logoDark && typeof branding.logoDark !== 'number' ? branding.logoDark : null
  const logoLight = branding?.logo && typeof branding.logo !== 'number' ? branding.logo : null
  const preferredLogo = logoDark || logoLight
  const logoUrl = preferredLogo?.url || null
  const logoAlt = preferredLogo?.alt || siteSettings?.siteName || 'Beyond AI'
  const logoHeight = branding?.logoHeight ?? 56

  return (
    <footer className="mt-16 border-t border-border bg-dark text-dark-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link className="flex items-center mb-4" href="/">
              <SiteLogo src={logoUrl} alt={logoAlt} height={logoHeight} />
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

          {columns.map((column, i) => (
            <div key={`${column.heading}-${i}`}>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                {column.heading}
              </h3>
              <nav className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                    className="text-sm text-muted-foreground hover:text-primary-deep transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <div id="footer-newsletter">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              {newsletterHeading}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{newsletterSubheading}</p>
            <NewsletterForm compact />

            <h3 className="font-semibold mb-4 mt-6 text-sm uppercase tracking-wider text-muted-foreground">
              Contact
            </h3>
            <div className="space-y-2 text-sm">
              {siteSettings?.contactEmail && (
                <p>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="text-muted-foreground hover:text-primary-deep transition-colors"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </p>
              )}
              {siteSettings?.contactPhone && (
                <p>
                  <a
                    href={`tel:${siteSettings.contactPhone}`}
                    className="text-muted-foreground hover:text-primary-deep transition-colors"
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
          <p className="text-sm text-muted-foreground">{copyright}</p>
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
