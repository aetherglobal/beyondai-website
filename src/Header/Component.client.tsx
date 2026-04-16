'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Nyansa Futures', href: '/nyansa-futures' },
  { label: 'Articles', href: '/posts' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
]

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="bg-dark text-dark-foreground sticky top-0 z-50 border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="shrink-0">
            <img src="/logo.png" alt="Beyond AI" className="h-10 md:h-14 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
            >
              Register Now
            </Link>

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
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 text-sm ${
                      isActive
                        ? 'text-primary bg-foreground/5'
                        : 'text-muted-foreground hover:text-primary hover:bg-foreground/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/events"
                className="mt-3 mx-3 inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
              >
                Register Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
