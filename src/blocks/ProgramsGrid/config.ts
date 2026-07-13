import type { Block } from 'payload'

export const ProgramsGrid: Block = {
  slug: 'programsGrid',
  interfaceName: 'ProgramsGridBlock',
  labels: { singular: 'Programs Grid', plural: 'Programs Grid' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (default)', value: 'grid' },
        { label: 'Showcase (numbered, alternating image + text rows)', value: 'showcase' },
      ],
    },
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
      admin: { condition: (_, siblingData) => siblingData?.layout !== 'showcase' },
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Used by the Showcase layout; falls back to a branded placeholder when empty.',
          },
        },
      ],
    },
  ],
}
