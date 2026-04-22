import type { Block } from 'payload'

export const LatestArticlesBlock: Block = {
  slug: 'latestArticles',
  interfaceName: 'LatestArticlesBlockType',
  labels: { singular: 'Latest Articles', plural: 'Latest Articles' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Latest Articles' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'View All Articles' },
    { name: 'ctaHref', type: 'text', defaultValue: '/posts' },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
  ],
}
