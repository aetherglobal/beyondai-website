'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import { DEFAULT_HEADER_NAV_ITEMS, DEFAULT_HEADER_CTA } from './defaults'
import { SiteLogo } from '@/components/SiteLogo'

interface HeaderClientProps {
  data: Header
  logoUrl?: string | null
  logoAlt?: string
  logoHeight?: number | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  logoUrl,
  logoAlt,
  logoHeight,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const navItemsFromCMS = (data?.navItems ?? []).map((item) => ({
    label: item.link?.label ?? '',
    href: resolveLinkHref(item.link),
    newTab: item.link?.newTab ?? false,
  }))
  const navItems = navItemsFromCMS.length > 0 ? navItemsFromCMS : DEFAULT_HEADER_NAV_ITEMS

  const cta = data?.ctaButton
  const ctaFromCMS = cta?.link?.label
    ? {
        label: cta.link.label,
        href: resolveLinkHref(cta.link),
        newTab: cta.link.newTab ?? false,
        enabled: cta.enabled !== false,
      }
    : null
  const ctaFallback = { ...DEFAULT_HEADER_CTA, newTab: false, enabled: true }
  const resolvedCta = ctaFromCMS ?? ctaFallback
  const ctaEnabled = resolvedCta.enabled
  const ctaHref = resolvedCta.href
  const ctaNewTab = resolvedCta.newTab
  const ctaLabel = resolvedCta.label

  const isActive = (href: string) =>
    href !== '#' && (pathname === href || (href !== '/' && pathname.startsWith(href)))

  return (
    <header className="bg-dark text-dark-foreground sticky top-0 z-50 border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="shrink-0">
            <SiteLogo src={logoUrl} alt={logoAlt} height={logoHeight} loading="eager" fetchPriority="high" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                  className={`px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'text-primary-deep font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {ctaEnabled && (
              <Link
                href={ctaHref}
                {...(ctaNewTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
              >
                {ctaLabel}
              </Link>
            )}

            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-6 border-t border-border mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {navItems.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                    className={`px-3 py-2.5 text-sm ${
                      active
                        ? 'text-foreground font-semibold border-l-2 border-primary bg-foreground/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {ctaEnabled && (
                <Link
                  href={ctaHref}
                  {...(ctaNewTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                  className="mt-3 mx-3 inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
