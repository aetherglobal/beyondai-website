import type { Block } from 'payload'

export const StatsRow: Block = {
  slug: 'statsRow',
  interfaceName: 'StatsRowBlock',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'number', type: 'text', required: true, admin: { description: 'e.g. "500+", "12"' } },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
