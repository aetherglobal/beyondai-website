import type { TextFieldSingleValidation } from 'payload'

import { isSafeHref } from '@/utilities/resolveLinkHref'

export const validateUrlField: TextFieldSingleValidation = (value, { required }) => {
  if (!value) return required ? 'This field is required.' : true

  if (!isSafeHref(value)) {
    return 'Enter a path starting with / or a full https:// URL. Other schemes are not allowed.'
  }

  return true
}

export const validateHostedUrlField =
  (hosts: string[]): TextFieldSingleValidation =>
  (value, { required }) => {
    if (!value) return required ? 'This field is required.' : true

    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' || !hosts.includes(url.hostname)) {
        return `Enter an https:// URL on ${hosts.join(' or ')}.`
      }
    } catch {
      return `Enter a full https:// URL on ${hosts.join(' or ')}.`
    }

    return true
  }
