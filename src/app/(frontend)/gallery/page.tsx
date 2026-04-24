import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { getGalleryImages } from '@/blocks/_data/cached-queries'
import { GalleryGrid } from '@/components/GalleryGrid'

import type { Event } from '@/payload-types'

export default async function GalleryPage() {
  const images = await getGalleryImages()

  const eventMap = new Map<string, string>()
  for (const img of images) {
    if (img.event && typeof img.event !== 'number') {
      const event = img.event as Event
      if (event.slug && event.title) {
        eventMap.set(event.slug, event.title)
      }
    }
  }
  const events = Array.from(eventMap, ([slug, title]) => ({ slug, title }))

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
          Gallery
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Relive the moments from our past events — panels, workshops, and community gatherings
          advancing AI governance across Africa.
        </p>
      </section>

      <Suspense>
        <GalleryGrid images={images} events={events} />
      </Suspense>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Gallery — Beyond AI',
  description:
    'Photos from Beyond AI events — panels, workshops, and community gatherings advancing AI governance in Africa.',
}
