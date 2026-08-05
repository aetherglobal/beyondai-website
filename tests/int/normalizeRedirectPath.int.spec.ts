import { describe, it, expect } from 'vitest'

import { normalizeRedirectPath } from '@/utilities/normalizeRedirectPath'

describe('normalizeRedirectPath', () => {
  it('leaves an already-canonical path untouched', () => {
    expect(normalizeRedirectPath('/nyansa2026')).toBe('/nyansa2026')
  })

  it('reduces the forms an editor is likely to paste to the same path', () => {
    // All four are what someone actually types when adding a short link; each one
    // used to save cleanly and then never match a request.
    expect(normalizeRedirectPath('https://beyondai.africa/nyansa2026')).toBe('/nyansa2026')
    expect(normalizeRedirectPath('nyansa2026')).toBe('/nyansa2026')
    expect(normalizeRedirectPath('/nyansa2026/')).toBe('/nyansa2026')
    expect(normalizeRedirectPath('  /Nyansa2026  ')).toBe('/nyansa2026')
  })

  it('keeps nested paths intact', () => {
    expect(normalizeRedirectPath('https://beyondai.africa/posts/some-article/')).toBe(
      '/posts/some-article',
    )
  })

  it('drops a query string or hash', () => {
    expect(normalizeRedirectPath('/nyansa2026?utm_source=whatsapp')).toBe('/nyansa2026')
    expect(normalizeRedirectPath('/nyansa2026#register')).toBe('/nyansa2026')
  })

  it('collapses every spelling of root to /', () => {
    expect(normalizeRedirectPath('/')).toBe('/')
    expect(normalizeRedirectPath('https://beyondai.africa')).toBe('/')
    expect(normalizeRedirectPath('https://beyondai.africa/')).toBe('/')
  })

  it('returns an empty string for missing or unusable input', () => {
    expect(normalizeRedirectPath(undefined)).toBe('')
    expect(normalizeRedirectPath(null)).toBe('')
    expect(normalizeRedirectPath('')).toBe('')
    expect(normalizeRedirectPath('   ')).toBe('')
  })
})
