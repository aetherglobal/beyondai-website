import type { Block } from 'payload'

export const FeaturedEventBlock: Block = {
  slug: 'featuredEvent',
  interfaceName: 'FeaturedEventBlockType',
  labels: { singular: 'Featured Event', plural: 'Featured Events' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '[Next Event]' },
  ],
}
