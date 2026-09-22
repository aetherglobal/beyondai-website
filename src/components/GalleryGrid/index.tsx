'use client'

import React, { useMemo, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { buildMediaLoader } from '@/utilities/payloadImageLoader'

import type { Event, GalleryImage, Media } from '@/payload-types'

const GalleryLightbox = dynamic(() => import('./GalleryLightbox'), { ssr: false })

type EventTab = { title: string; slug: string }

type GalleryGridProps = {
  images: GalleryImage[]
  events: EventTab[]
}

function toPhoto(img: GalleryImage) {
  const media = img.image as Media
  const src = getMediaUrl(media.url, media.updatedAt)
  return {
    src,
    width: media.width ?? 800,
    height: media.height ?? 600,
    alt: media.alt || img.caption || '',
    key: String(img.id),
    loader: buildMediaLoader(media),
  }
}

function toSlide(img: GalleryImage) {
  const media = img.image as Media
  const src = getMediaUrl(media.url, media.updatedAt)
  return {
    src,
    width: media.width ?? 800,
    height: media.height ?? 600,
    alt: media.alt || img.caption || '',
    description: img.caption || undefined,
  }
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, events }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeEvent = searchParams.get('event') || ''

  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [lightboxReady, setLightboxReady] = useState(false)

  const handleFilterClick = useCallback(
    (slug: string) => {
      if (slug === '') {
        router.push('/gallery', { scroll: false })
      } else {
        router.push(`/gallery?event=${slug}`, { scroll: false })
      }
    },
    [router],
  )

  const filteredImages = useMemo(() => {
    if (!activeEvent) return images
    return images.filter((img) => {
      if (!img.event || typeof img.event === 'number') return false
      return (img.event as Event).slug === activeEvent
    })
  }, [images, activeEvent])

  const photos = useMemo(() => filteredImages.map(toPhoto), [filteredImages])
  const slides = useMemo(() => filteredImages.map(toSlide), [filteredImages])

  type TabWithCount = EventTab & { count: number }

  const allTabs: TabWithCount[] = useMemo(() => {
    const tabsWithCounts = events.map((e) => {
      const count = images.filter((img) => {
        if (!img.event || typeof img.event === 'number') return false
        return (img.event as Event).slug === e.slug
      }).length
      return { ...e, count }
    })
    return [{ title: 'All', slug: '', count: images.length }, ...tabsWithCounts]
  }, [events, images])

  return (
    <>
      <div className="sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {allTabs.map((tab) => {
              const isActive = tab.slug === activeEvent

              return (
                <button
                  key={tab.slug}
                  onClick={() => handleFilterClick(tab.slug)}
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors rounded-full',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeGalleryEvent"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab.title}
                    <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section className="container py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {filteredImages.length > 0 ? (
              <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4 [&>*]:mb-3">
                {photos.map((photo, index) => (
                  <button
                    key={photo.key}
                    type="button"
                    aria-label={photo.alt || `Open photo ${index + 1}`}
                    onClick={() => {
                      setLightboxReady(true)
                      setLightboxIndex(index)
                    }}
                    className="relative block w-full break-inside-avoid overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                  >
                    <Image
                      fill
                      src={photo.src}
                      loader={photo.loader}
                      alt={photo.alt}
                      sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 292px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No photos found for this event.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {lightboxReady && (
        <GalleryLightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={slides}
        />
      )}
    </>
  )
}
