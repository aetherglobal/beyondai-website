'use client'

import React from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'

type Slide = {
  src: string
  width: number
  height: number
  alt: string
  description?: string
}

type GalleryLightboxProps = {
  open: boolean
  index: number
  close: () => void
  slides: Slide[]
}

export default function GalleryLightbox({ open, index, close, slides }: GalleryLightboxProps) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={close}
      slides={slides}
      plugins={[Thumbnails, Zoom, Captions, Counter]}
      captions={{ descriptionTextAlign: 'center' }}
      counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      thumbnails={{ position: 'bottom', width: 100, height: 60, gap: 8 }}
    />
  )
}
