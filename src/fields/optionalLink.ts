import type { Field, GroupField } from 'payload'

import { link as linkHelper } from './link'

type LinkArgs = Parameters<typeof linkHelper>[0]

const stripRequired = (fields: Field[]): void => {
  for (const f of fields) {
    if ('required' in f) {
      delete (f as { required?: boolean }).required
    }
    if ('fields' in f && Array.isArray((f as GroupField).fields)) {
      stripRequired((f as GroupField).fields as Field[])
    }
  }
}

export const optionalLink = (options?: LinkArgs): Field => {
  const field = linkHelper(options) as GroupField
  stripRequired(field.fields as Field[])
  return field
}
