import { describe, it, expect } from 'vitest'

import { getThemeStyle } from '@/utilities/getThemeStyle'
import { isSafeHref, resolveLinkHref } from '@/utilities/resolveLinkHref'
import { validateUrlField, validateHostedUrlField } from '@/fields/validateUrlField'
import type { SiteSetting } from '@/payload-types'

const settingsWith = (colors: Record<string, string>) =>
  ({ theme: { colors } }) as unknown as SiteSetting

describe('getThemeStyle', () => {
  it('emits valid colour values', () => {
    expect(getThemeStyle(settingsWith({ primary: '#ff0000' }))).toBe(':root { --primary: #ff0000; }')
    expect(getThemeStyle(settingsWith({ primaryDeep: 'oklch(52% 0.15 78deg)' }))).toContain(
      '--primary-deep: oklch(52% 0.15 78deg);',
    )
  })

  it('drops a value that would break out of the style element', () => {
    const css = getThemeStyle(settingsWith({ primary: 'red; } </style><script>alert(1)</script>' }))

    expect(css).not.toContain('<script>')
    expect(css).not.toContain('</style>')
    expect(css).toBe('')
  })

  it('drops values containing CSS control characters', () => {
    for (const bad of ['red; background: url(evil)', 'red } body {', '@import url(evil)']) {
      expect(getThemeStyle(settingsWith({ primary: bad }))).toBe('')
    }
  })

  it('coerces layout numbers and ignores non-numeric input', () => {
    const settings = { theme: { layout: { radius: 8 } } } as unknown as SiteSetting
    expect(getThemeStyle(settings)).toBe(':root { --radius: 8px; }')

    const bad = { theme: { layout: { radius: '4px; } html {' } } } as unknown as SiteSetting
    expect(getThemeStyle(bad)).toBe('')
  })
})

describe('isSafeHref', () => {
  it('allows relative paths, fragments and ordinary schemes', () => {
    for (const href of ['/events', '#section', '?q=1', 'https://lu.ma/x', 'mailto:a@b.com', 'tel:+233']) {
      expect(isSafeHref(href)).toBe(true)
    }
  })

  it('rejects script-bearing and opaque schemes', () => {
    for (const href of [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'data:text/html;base64,PHNjcmlwdD4=',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
    ]) {
      expect(isSafeHref(href)).toBe(false)
    }
  })
})

describe('resolveLinkHref', () => {
  it('falls back to # rather than emitting an unsafe href', () => {
    expect(resolveLinkHref({ type: 'custom', url: 'javascript:alert(1)' })).toBe('#')
    expect(resolveLinkHref(null)).toBe('#')
  })

  it('passes through safe custom URLs and resolves references', () => {
    expect(resolveLinkHref({ type: 'custom', url: '/about' })).toBe('/about')
    expect(
      resolveLinkHref({
        type: 'reference',
        reference: { relationTo: 'posts', value: { slug: 'hello' } },
      }),
    ).toBe('/posts/hello')
  })
})

describe('URL field validators', () => {
  const opts = { required: false } as never

  it('rejects an unsafe scheme at write time', () => {
    expect(validateUrlField('javascript:alert(1)', opts)).toEqual(expect.any(String))
    expect(validateUrlField('/events', opts)).toBe(true)
  })

  it('pins hosted fields to the allowed host', () => {
    const validate = validateHostedUrlField(['lu.ma', 'www.lu.ma'])

    expect(validate('https://lu.ma/abc123', opts)).toBe(true)
    expect(validate('https://evil.example/abc', opts)).toEqual(expect.any(String))
    expect(validate('http://lu.ma/abc', opts)).toEqual(expect.any(String))
  })
})
