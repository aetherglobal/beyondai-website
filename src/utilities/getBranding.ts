import type { SiteSetting } from '@/payload-types'

import { getCachedGlobal } from './getGlobals'

export type Branding = {
  logoUrl: string | null
  logoAlt: string
  logoHeight: number
  siteName: string
}

export async function getBranding(): Promise<Branding> {
  const settings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting | null
  const branding = settings?.branding
  const siteName = settings?.siteName || 'Beyond AI'

  const logoDark =
    branding?.logoDark && typeof branding.logoDark !== 'number' ? branding.logoDark : null
  const logoLight = branding?.logo && typeof branding.logo !== 'number' ? branding.logo : null
  const preferredLogo = logoDark || logoLight

  return {
    logoUrl: preferredLogo?.url || null,
    logoAlt: preferredLogo?.alt || siteName,
    logoHeight: branding?.logoHeight ?? 56,
    siteName,
  }
}
