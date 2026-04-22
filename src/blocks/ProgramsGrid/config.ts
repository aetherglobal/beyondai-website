import type { Block } from 'payload'

import { optionalLink } from '@/fields/optionalLink'

export const ProgramsGrid: Block = {
  slug: 'programsGrid',
  interfaceName: 'ProgramsGridBlock',
  labels: { singular: 'Programs Grid', plural: 'Programs Grid' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'White', value: 'white' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        optionalLink({ appearances: false }),
      ],
    },
  ],
}
