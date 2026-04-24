import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { GalleryImage } from '../../../payload-types'

export const revalidateGallery: CollectionAfterChangeHook<GalleryImage> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating gallery cache`)
      revalidatePath('/gallery', 'page')
      revalidateTag('gallery-images', 'max')
    } catch {}
  }
  return doc
}

export const revalidateDeleteGallery: CollectionAfterDeleteHook<GalleryImage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      revalidatePath('/gallery', 'page')
      revalidateTag('gallery-images', 'max')
    } catch {}
  }
  return doc
}
