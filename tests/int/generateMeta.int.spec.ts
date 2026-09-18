import { describe, it, expect } from 'vitest'

import { generateMeta } from '@/utilities/generateMeta'
import type { Media, Post } from '@/payload-types'

const cloudfrontImage = {
  url: 'https://d11rlzbty4jyiq.cloudfront.net/hero.jpg',
  sizes: { og: { url: 'https://d11rlzbty4jyiq.cloudfront.net/hero-1200x630.jpg' } },
} as unknown as Media

const localImage = { url: '/api/media/file/hero.jpg', sizes: {} } as unknown as Media

const postWith = (image: Media | null) =>
  ({ title: 'Hello', meta: { title: 'Hello', description: 'A post', image } }) as unknown as Post

describe('generateMeta og:image', () => {
  it('leaves an already-absolute media URL alone', async () => {
    const meta = await generateMeta({ doc: postWith(cloudfrontImage), path: '/posts/hello' })
    const images = meta.openGraph?.images as { url: string }[]

    expect(images[0].url).toBe('https://d11rlzbty4jyiq.cloudfront.net/hero-1200x630.jpg')
    expect(() => new URL(images[0].url)).not.toThrow()
  })

  it('prefixes the origin onto a relative media URL', async () => {
    const meta = await generateMeta({ doc: postWith(localImage), path: '/posts/hello' })
    const images = meta.openGraph?.images as { url: string }[]

    expect(images[0].url).toMatch(/^https?:\/\/[^/]+\/api\/media\/file\/hero\.jpg$/)
  })

  it('falls back to the default share card when the doc has no image', async () => {
    const meta = await generateMeta({ doc: postWith(null), path: '/posts/hello' })
    const images = meta.openGraph?.images as { url: string }[]

    expect(images).toHaveLength(1)
    expect(images[0].url).toMatch(/\/og-default\.png$/)
  })

  it('never emits a doubled scheme', async () => {
    for (const image of [cloudfrontImage, localImage, null]) {
      const meta = await generateMeta({ doc: postWith(image), path: '/x' })
      const images = meta.openGraph?.images as { url: string }[]
      expect(images[0].url).not.toMatch(/https?:\/\/[^/]+https?/)
    }
  })
})
