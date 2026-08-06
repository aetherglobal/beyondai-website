import { describe, it, expect } from 'vitest'

import type { Media } from '@/payload-types'

import { buildMediaLoader } from '@/utilities/payloadImageLoader'

const CDN = 'https://cdn.example.net'

const media = (overrides: Partial<Media> = {}): Media =>
  ({
    id: 1,
    updatedAt: '2026-06-30T13:44:26.979Z',
    createdAt: '2026-06-30T13:44:26.979Z',
    url: `${CDN}/photo.jpg`,
    width: 2400,
    height: 1600,
    sizes: {
      thumbnail: { url: `${CDN}/photo-300x200.jpg`, width: 300, height: 200 },
      square: { url: `${CDN}/photo-500x500.jpg`, width: 500, height: 500 },
      small: { url: `${CDN}/photo-600x400.jpg`, width: 600, height: 400 },
      medium: { url: `${CDN}/photo-900x600.jpg`, width: 900, height: 600 },
      large: { url: `${CDN}/photo-1400x933.jpg`, width: 1400, height: 933 },
      xlarge: { url: `${CDN}/photo-1920x1280.jpg`, width: 1920, height: 1280 },
      og: { url: `${CDN}/photo-1200x630.jpg`, width: 1200, height: 630 },
    },
    ...overrides,
  }) as Media

const load = (resource: Media, width: number) => {
  const loader = buildMediaLoader(resource)
  if (!loader) throw new Error('expected a loader')
  return loader({ src: resource.url ?? '', width, quality: 75 })
}

describe('buildMediaLoader', () => {
  it('never routes through the Vercel image optimiser', () => {
    for (const width of [300, 600, 900, 1400, 1920]) {
      expect(load(media(), width)).not.toContain('/_next/image')
      expect(load(media(), width)).toContain(CDN)
    }
  })

  it('serves each configured srcset width from a file Payload already rendered', () => {
    expect(load(media(), 300)).toContain('photo-300x200.jpg')
    expect(load(media(), 600)).toContain('photo-600x400.jpg')
    expect(load(media(), 900)).toContain('photo-900x600.jpg')
    expect(load(media(), 1400)).toContain('photo-1400x933.jpg')
    expect(load(media(), 1920)).toContain('photo-1920x1280.jpg')
  })

  it('rounds up to the next stored size rather than down', () => {
    expect(load(media(), 301)).toContain('photo-600x400.jpg')
    expect(load(media(), 700)).toContain('photo-900x600.jpg')
  })

  it('skips the square and og crops', () => {
    expect(load(media(), 500)).not.toContain('500x500')
    expect(load(media(), 1200)).not.toContain('1200x630')
  })

  it('falls back to the original when the request outgrows every variant', () => {
    expect(load(media(), 3840)).toContain('photo.jpg')
  })

  it('uses the widest available size when Payload skipped the upscales', () => {
    const small = media({
      url: `${CDN}/small.jpg`,
      width: 792,
      height: 944,
      sizes: {
        thumbnail: { url: `${CDN}/small-300x358.jpg`, width: 300, height: 358 },
        small: { url: `${CDN}/small-600x715.jpg`, width: 600, height: 715 },
        medium: { url: null, width: null, height: null },
        large: { url: null, width: null, height: null },
        xlarge: { url: null, width: null, height: null },
      },
    } as Partial<Media>)

    expect(load(small, 600)).toContain('small-600x715.jpg')
    expect(load(small, 1920)).toContain('small.jpg')
  })

  it('carries the cache tag so a replaced image is not served from browser cache', () => {
    expect(load(media(), 600)).toBe(`${CDN}/photo-600x400.jpg?2026-06-30T13%3A44%3A26.979Z`)
  })

  it('percent-encodes filenames so a space cannot split a srcset candidate', () => {
    const spaced = media({
      url: `${CDN}/AI Without Borders.jpg`,
      sizes: {
        small: { url: `${CDN}/AI Without Borders-600x338.jpg`, width: 600, height: 338 },
      },
    } as Partial<Media>)

    expect(load(spaced, 600)).toBe(
      `${CDN}/AI%20Without%20Borders-600x338.jpg?2026-06-30T13%3A44%3A26.979Z`,
    )
    expect(load(spaced, 3840)).not.toMatch(/ /)
  })

  it('leaves an already-encoded filename alone', () => {
    const encoded = media({
      url: `${CDN}/already%20encoded.jpg`,
      sizes: { small: { url: `${CDN}/already%20encoded-600x400.jpg`, width: 600, height: 400 } },
    } as Partial<Media>)

    expect(load(encoded, 600)).toContain('already%20encoded-600x400.jpg')
    expect(load(encoded, 600)).not.toContain('%2520')
  })

  it('declines to build a loader when there is nothing to serve', () => {
    expect(buildMediaLoader(media({ url: null, width: null, sizes: {} }))).toBeUndefined()
  })
})
