import type { Metadata } from 'next'

import localFont from 'next/font/local'
import React, { Suspense } from 'react'

const clashGrotesk = localFont({
  src: './fonts/ClashGrotesk-Variable.woff2',
  variable: '--font-clash-grotesk',
  display: 'swap',
  weight: '200 700',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
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
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { AnalyticsPageView } from '@/components/Analytics/AnalyticsPageView'
import { CookieConsent } from '@/components/CookieConsent'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting | null
  const themeCss = getThemeStyle(settings)
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const favicon =
    settings?.branding?.favicon && typeof settings.branding.favicon !== 'number'
      ? settings.branding.favicon
      : null
  const faviconUrl = favicon?.url

  return (
    <html className={clashGrotesk.variable} lang="en" data-scroll-behavior="smooth">
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
        {gaId ? (
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
          </Script>
        ) : null}
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          {gaId ? <CookieConsent /> : null}
        </Providers>
        {gaId ? (
          <>
            <Suspense fallback={null}>
              <AnalyticsPageView />
            </Suspense>
            <GoogleAnalytics gaId={gaId} />
          </>
        ) : null}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Beyond AI | AI Governance & Digital Transformation in Africa',
    template: 'Beyond AI | %s',
  },
  description:
    'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@beyondai_africa',
  },
}
