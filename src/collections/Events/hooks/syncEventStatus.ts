import type { CollectionBeforeChangeHook } from 'payload'

import type { Event } from '../../../payload-types'

export const syncEventStatus: CollectionBeforeChangeHook<Event> = ({ data }) => {
  if (!data.date || data.eventStatus === 'cancelled') return data

  const eventDate = new Date(data.date)
  const now = new Date()

  data.eventStatus = eventDate < now ? 'past' : 'upcoming'

  return data
}
