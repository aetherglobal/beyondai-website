import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import {
  Sora,
  Inter,
  Manrope,
  DM_Sans,
  Space_Grotesk,
  IBM_Plex_Sans,
  Space_Mono,
  JetBrains_Mono,
  IBM_Plex_Mono,
} from 'next/font/google'
import React from 'react'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getThemeStyle } from '@/utilities/getThemeStyle'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const themeCss = await getThemeStyle()
  const settings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting | null

  const favicon =
    settings?.branding?.favicon && typeof settings.branding.favicon !== 'number'
      ? settings.branding.favicon
      : null
  const faviconUrl = favicon?.url

  const fontClasses = cn(
    sora.variable,
    inter.variable,
    manrope.variable,
    dmSans.variable,
    spaceGrotesk.variable,
    ibmPlexSans.variable,
    spaceMono.variable,
    jetbrainsMono.variable,
    ibmPlexMono.variable,
  )

  return (
    <html className={fontClasses} lang="en" data-scroll-behavior="smooth">
      <head>
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        {faviconUrl ? (
          <link href={faviconUrl} rel="icon" />
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Beyond AI — AI Governance & Digital Transformation in Africa',
    template: '%s — Beyond AI',
  },
  description:
    'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@beyondai_africa',
  },
}
