import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Person } from '../../../payload-types'

const revalidateEvents = async (payload: BasePayload, personId?: number | string) => {
  const events = await payload.find({
    collection: 'events',
    depth: 0,
    limit: 100,
    pagination: false,
    select: { slug: true },
    ...(personId
      ? {
          where: {
            or: [
              { 'hosts.person': { equals: personId } },
              { 'speakers.person': { equals: personId } },
            ],
          },
        }
      : {}),
  })

  events.docs.forEach((event) => {
    if (event.slug) revalidatePath(`/events/${event.slug}`)
  })
}

export const revalidatePerson: CollectionAfterChangeHook<Person> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating events for person: ${doc.name}`)
      await revalidateEvents(payload, doc.id)
    } catch {}
  }
  return doc
}

export const revalidateDeletePerson: CollectionAfterDeleteHook<Person> = async ({
  req: { payload, context },
  doc,
}) => {
  if (!context.disableRevalidate) {
    try {
      await revalidateEvents(payload)
    } catch {}
  }
  return doc
}
