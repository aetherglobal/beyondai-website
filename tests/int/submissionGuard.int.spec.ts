import { describe, it, expect } from 'vitest'

import { guardSubmission, trim, withTimeout } from '@/utilities/submissionGuard'

const post = (body: unknown, headers: Record<string, string> = {}, ip = '203.0.113.1') =>
  new Request('https://beyondai.africa/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

describe('guardSubmission', () => {
  it('accepts a well-formed submission', async () => {
    const result = await guardSubmission(post({ email: 'a@b.com', name: 'Ada' }, {}, '198.51.100.1'))

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data).toMatchObject({ email: 'a@b.com', name: 'Ada' })
  })

  it('rejects a malformed email', async () => {
    const result = await guardSubmission(post({ email: 'not-an-email' }, {}, '198.51.100.2'))

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(400)
  })

  it('rejects an unparseable body', async () => {
    const result = await guardSubmission(post('{not json', {}, '198.51.100.3'))

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(400)
  })

  it('rejects an oversized body by declared content-length', async () => {
    const result = await guardSubmission(
      post({ email: 'a@b.com' }, { 'content-length': String(64 * 1024) }, '198.51.100.4'),
    )

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(413)
  })

  it('swallows a tripped honeypot with a 200, so a bot learns nothing', async () => {
    const result = await guardSubmission(
      post({ email: 'a@b.com', website: 'http://spam.example' }, {}, '198.51.100.5'),
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(200)
      await expect(result.response.json()).resolves.toEqual({ success: true })
    }
  })

  it('ignores an empty honeypot', async () => {
    const result = await guardSubmission(
      post({ email: 'a@b.com', website: '' }, {}, '198.51.100.6'),
    )

    expect(result.ok).toBe(true)
  })

  it('rate limits a single source after 5 submissions in the window', async () => {
    const ip = '198.51.100.99'
    const statuses: (number | 'ok')[] = []

    for (let i = 0; i < 7; i++) {
      const result = await guardSubmission(post({ email: 'a@b.com' }, {}, ip))
      statuses.push(result.ok ? 'ok' : result.response.status)
    }

    expect(statuses.slice(0, 5)).toEqual(['ok', 'ok', 'ok', 'ok', 'ok'])
    expect(statuses.slice(5)).toEqual([429, 429])
  })

  it('counts each source separately', async () => {
    for (let i = 0; i < 6; i++) await guardSubmission(post({ email: 'a@b.com' }, {}, '198.51.100.7'))

    const other = await guardSubmission(post({ email: 'a@b.com' }, {}, '198.51.100.8'))
    expect(other.ok).toBe(true)
  })
})

describe('trim', () => {
  it('truncates to the column limit', () => {
    expect(trim('x'.repeat(200), 120)).toHaveLength(120)
  })

  it('returns undefined for blank and non-string values', () => {
    expect(trim('   ', 10)).toBeUndefined()
    expect(trim(undefined, 10)).toBeUndefined()
    expect(trim(42, 10)).toBeUndefined()
  })

  it('strips surrounding whitespace', () => {
    expect(trim('  Ada  ', 10)).toBe('Ada')
  })
})

describe('withTimeout', () => {
  it('resolves when the promise wins', async () => {
    await expect(withTimeout(Promise.resolve('done'), 1000, 'test')).resolves.toBe('done')
  })

  it('rejects when the deadline passes first', async () => {
    const never = new Promise((resolve) => setTimeout(resolve, 5000))

    await expect(withTimeout(never, 10, 'Mailchimp')).rejects.toThrow(/Mailchimp timed out/)
  })
})
