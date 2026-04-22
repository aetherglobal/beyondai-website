import type { Block } from 'payload'

export const ObjectivesGrid: Block = {
  slug: 'objectivesGrid',
  interfaceName: 'ObjectivesGridBlock',
  labels: { singular: 'Objectives Grid', plural: 'Objectives Grid' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', required: true, admin: { description: 'e.g. "01", "02"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
