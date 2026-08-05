/**
 * Canonical form of a redirect's `from` path, applied both when an editor saves a
 * redirect and when a request is matched against one. Without this, an entry saved as
 * `https://beyondai.africa/nyansa2026` or `nyansa2026/` looks correct in the admin panel
 * and then silently never fires.
 */
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
