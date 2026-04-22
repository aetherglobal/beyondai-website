import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Sponsor } from '../../../payload-types'

export const revalidateSponsor: CollectionAfterChangeHook<Sponsor> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating sponsors cache`)
      revalidatePath('/sponsors')
      revalidatePath('/')
      revalidateTag('sponsors', 'max')
    } catch {}
  }
  return doc
}

export const revalidateDeleteSponsor: CollectionAfterDeleteHook<Sponsor> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      revalidatePath('/sponsors')
      revalidatePath('/')
      revalidateTag('sponsors', 'max')
    } catch {}
  }
  return doc
}
