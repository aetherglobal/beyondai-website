import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { LumaEmbed } from '@/components/LumaEmbed'
import { SponsorGrid } from '@/components/SponsorGrid'

import type { Event, Sponsor } from '@/payload-types'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return events.docs.map(({ slug }) => ({ slug }))
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug })

  if (!event) {
    notFound()
  }

  const {
    title,
    date,
    endDate,
    location,
    isVirtual,
    description,
    heroImage,
    speakers,
    agenda,
    lumaEventUrl,
    lumaEmbedUrl,
    partnerLogos,
  } = event

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const partners = (partnerLogos || []).filter(
    (s): s is Sponsor => typeof s !== 'number',
  )

  return (
    <article className="pt-16 pb-24">
      {/* Hero Image */}
      {heroImage && typeof heroImage !== 'number' && (
        <div className="container py-4">
          <Media resource={heroImage} className="w-full rounded-lg aspect-[21/9] object-cover" />
        </div>
      )}

      <div className="container py-12">
        <div className="max-w-3xl">
          {/* Title & Meta */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground mb-8">
            <span>{formattedDate} at {formattedTime}</span>
            {endDate && (
              <span>
                — {new Date(endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {location && <span>· {location}</span>}
            {isVirtual && <span>· Virtual</span>}
          </div>

          {/* Description */}
          {description && <RichText data={description} className="mb-12" />}

          {/* Registration */}
          <LumaEmbed embedUrl={lumaEmbedUrl} eventUrl={lumaEventUrl} className="mb-12" />
        </div>

        {/* Speakers */}
        {speakers && speakers.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Speakers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {speakers.map((speaker, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  {speaker.photo && typeof speaker.photo !== 'number' && (
                    <Media
                      resource={speaker.photo}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{speaker.name}</h3>
                  {speaker.title && (
                    <p className="text-sm text-muted-foreground">{speaker.title}</p>
                  )}
                  {speaker.bio && (
                    <p className="text-sm text-muted-foreground mt-2">{speaker.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Agenda */}
        {agenda && agenda.length > 0 && (
          <section className="py-8 max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">Agenda</h2>
            <div className="divide-y divide-border">
              {agenda.map((item, i) => (
                <div key={i} className="py-4">
                  <div className="flex gap-4">
                    <span className="text-sm font-mono text-muted-foreground min-w-[80px]">
                      {item.time}
                    </span>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Partners */}
        {partners.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Event Partners</h2>
            <SponsorGrid sponsors={partners} />
          </section>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug })

  if (!event) return {}

  return {
    title: `${event.title} — Beyond AI`,
    description: `Join us for ${event.title} on ${new Date(event.date).toLocaleDateString()}.`,
  }
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    limit: 1,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  return (result.docs?.[0] as Event) || null
})
