import type { Block } from 'payload'

export const PastEventsBlock: Block = {
  slug: 'pastEvents',
  interfaceName: 'PastEventsBlockType',
  labels: { singular: 'Past Events', plural: 'Past Events' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '[Past Events]' },
    { name: 'heading', type: 'text', defaultValue: 'Previous Events' },
    { name: 'limit', type: 'number', defaultValue: 20, min: 1, max: 100 },
  ],
}
