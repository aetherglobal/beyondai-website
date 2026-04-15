import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      try {
        if (doc.slug) {
          payload.logger.info(`Revalidating event at path: /events/${doc.slug}`)
          revalidatePath(`/events/${doc.slug}`)
        }
        revalidatePath('/events')
        revalidatePath('/')
        revalidateTag('events-sitemap', 'max')
      } catch {}
    }
  }
  return doc
}

export const revalidateDeleteEvent: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (doc?.slug) {
        revalidatePath(`/events/${doc.slug}`)
      }
      revalidatePath('/events')
      revalidatePath('/')
      revalidateTag('events-sitemap', 'max')
    } catch {}
  }

  return doc
}
