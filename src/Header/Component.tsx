import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'
import React from 'react'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('site-settings', 1)() as Promise<SiteSetting | null>,
  ])

  const branding = siteSettings?.branding
  const logoDark = branding?.logoDark && typeof branding.logoDark !== 'number' ? branding.logoDark : null
  const logoLight = branding?.logo && typeof branding.logo !== 'number' ? branding.logo : null
  const preferredLogo = logoDark || logoLight
  const logoUrl = preferredLogo?.url || null
  const logoAlt = preferredLogo?.alt || siteSettings?.siteName || 'Beyond AI'
  const logoHeight = branding?.logoHeight ?? 56

  return (
    <HeaderClient
      data={headerData}
      logoUrl={logoUrl}
      logoAlt={logoAlt}
      logoHeight={logoHeight}
    />
  )
}
