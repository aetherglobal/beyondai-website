import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { assertTestDatabase } from './assertTestDatabase'

export async function seedFixture(): Promise<void> {
  assertTestDatabase('seedFixture')

  const payload = await getPayload({ config })

  const richText = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Fixture body copy.', version: 1 }],
        },
      ],
    },
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    pagination: false,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        _status: 'published',
        hero: {
          type: 'lowImpact',
          heading: 'Beyond AI',
          subtitle: 'Fixture hero for the end-to-end suite.',
        },
        layout: [
          {
            blockType: 'content',
            columns: [{ size: 'full', richText, enableLink: false }],
          },
        ],
      },
      context: { disableRevalidate: true },
    } as any)
  }

  const posts = await payload.count({ collection: 'posts' })
  if (posts.totalDocs === 0) {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Fixture Article',
        slug: 'fixture-article',
        _status: 'published',
        publishedAt: new Date('2026-03-14T09:00:00.000Z').toISOString(),
        content: richText,
      } as any,
      context: { disableRevalidate: true },
    })
  }

  const events = await payload.count({ collection: 'events' })
  if (events.totalDocs === 0) {
    await payload.create({
      collection: 'events',
      data: {
        title: 'Fixture Event',
        slug: 'fixture-event',
        _status: 'published',
        eventType: 'ai-watch',
        eventStatus: 'upcoming',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Accra, Ghana',
        description: richText,
      } as any,
      context: { disableRevalidate: true },
    })
  }

  payload.logger.info('E2E fixture ready.')
}
