import React from 'react'

import type { Event, Post, SiteSetting } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const ORG_ID = `${getServerSideURL()}/#organization`

type JsonLd = Record<string, unknown>

export const StructuredData: React.FC<{ data: JsonLd | JsonLd[] }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)

const mediaUrl = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object' || !('url' in value)) return undefined
  const url = (value as { url?: string | null }).url
  if (!url) return undefined
  return /^https?:\/\//i.test(url) ? url : `${getServerSideURL()}${url}`
}

export const organizationSchema = (settings: SiteSetting | null): JsonLd[] => {
  const site = getServerSideURL()
  const social = settings?.socialLinks ?? {}
  const sameAs = [social.twitter, social.linkedin, social.instagram, social.youtube, social.facebook]
    .filter((v): v is string => typeof v === 'string' && v.length > 0)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: settings?.siteName || 'Beyond AI',
      url: site,
      description:
        settings?.siteDescription ||
        'A civic platform for AI governance and digital transformation in Africa.',
      logo: `${site}/logo.png`,
      ...(sameAs.length > 0 ? { sameAs } : {}),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Accra',
        addressRegion: 'Greater Accra',
        addressCountry: 'GH',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      url: site,
      name: settings?.siteName || 'Beyond AI',
      publisher: { '@id': ORG_ID },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${site}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ]
}

export const eventSchema = (event: Event): JsonLd => {
  const site = getServerSideURL()
  const image = mediaUrl(event.heroImage) || mediaUrl(event.flyerImage)

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    url: `${site}/events/${event.slug}`,
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus:
      event.eventStatus === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isVirtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isVirtual
      ? { '@type': 'VirtualLocation', url: event.lumaEventUrl || `${site}/events/${event.slug}` }
      : {
          '@type': 'Place',
          name: event.location || 'Accra, Ghana',
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.location || 'Accra',
            addressCountry: 'GH',
          },
        },
    ...(image ? { image: [image] } : {}),
    ...(event.meta?.description ? { description: event.meta.description } : {}),
    organizer: { '@id': ORG_ID },
    ...(event.lumaEventUrl
      ? {
          offers: {
            '@type': 'Offer',
            url: event.lumaEventUrl,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    ...(Array.isArray(event.speakers) && event.speakers.length > 0
      ? {
          performer: event.speakers
            .map((s) => (typeof s === 'object' && s ? (s as { name?: string }).name : null))
            .filter((n): n is string => Boolean(n))
            .map((name) => ({ '@type': 'Person', name })),
        }
      : {}),
  }
}

export const articleSchema = (post: Post, authors: string[]): JsonLd => {
  const site = getServerSideURL()
  const image = mediaUrl(post.heroImage) || mediaUrl(post.meta?.image)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    url: `${site}/posts/${post.slug}`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    ...(image ? { image: [image] } : {}),
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    author:
      authors.length > 0
        ? authors.map((name) => ({ '@type': 'Person', name }))
        : [{ '@type': 'Organization', name: 'Beyond AI', '@id': ORG_ID }],
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site}/posts/${post.slug}` },
  }
}
