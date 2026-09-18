import type { CollectionBeforeValidateHook } from 'payload'
import { ValidationError } from 'payload'

export const MIN_PASSWORD_LENGTH = 15
export const MAX_PASSWORD_LENGTH = 100

export const enforcePasswordPolicy: CollectionBeforeValidateHook = ({ data }) => {
  const password = (data as { password?: unknown } | undefined)?.password

  if (typeof password !== 'string' || password.length === 0) return data

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError({
      errors: [
        {
          path: 'password',
          message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters. Length matters more than symbols — a passphrase of ordinary words is both stronger and easier to remember.`,
        },
      ],
    })
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new ValidationError({
      errors: [
        { path: 'password', message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.` },
      ],
    })
  }

  return data
}
