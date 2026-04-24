'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MasonryPhotoAlbum, RenderImageContext, RenderImageProps } from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import 'react-photo-album/masonry.css'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'

import type { Event, GalleryImage, Media } from '@/payload-types'

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

function renderNextImage(
  { alt = '', title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo.src}
        alt={alt}
        title={title}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  )
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, events }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeEvent = searchParams.get('event') || ''

  const [lightboxIndex, setLightboxIndex] = useState(-1)

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
              <MasonryPhotoAlbum
                photos={photos}
                columns={(containerWidth) => {
                  if (containerWidth < 640) return 1
                  if (containerWidth < 768) return 2
                  if (containerWidth < 1024) return 3
                  return 4
                }}
                spacing={12}
                onClick={({ index }) => setLightboxIndex(index)}
                render={{ image: renderNextImage }}
                defaultContainerWidth={1200}
                sizes={{
                  size: '1168px',
                  sizes: [
                    { viewport: '(max-width: 640px)', size: 'calc(100vw - 32px)' },
                    { viewport: '(max-width: 1200px)', size: 'calc(100vw - 32px)' },
                  ],
                }}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No photos found for this event.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Thumbnails, Zoom, Captions, Counter]}
        captions={{ descriptionTextAlign: 'center' }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        thumbnails={{ position: 'bottom', width: 100, height: 60, gap: 8 }}
      />
    </>
  )
}
