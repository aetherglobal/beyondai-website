export const normalizeRedirectPath = (value?: string | null): string => {
  if (typeof value !== 'string') return ''

  let path = value.trim()
  if (!path) return ''

  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname
    } catch {
      return ''
    }
  }

  path = path.split(/[?#]/)[0]

  if (!path.startsWith('/')) path = `/${path}`

  path = path.replace(/\/+$/, '')

  return path.toLowerCase() || '/'
}
