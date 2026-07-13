import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { optionalLink } from '@/fields/optionalLink'

export const StatementSection: Block = {
  slug: 'statementSection',
  interfaceName: 'StatementSectionBlock',
  labels: { singular: 'Statement Section', plural: 'Statement Sections' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (text + single image)', value: 'default' },
        { label: 'Collage (centered heading + 3-image collage)', value: 'collage' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Primary heading. Line breaks in the text become <br/> in the output.' },
    },
    {
      name: 'sideCta',
      type: 'group',
      admin: {
        description: 'Optional action button shown to the right of the heading at the top.',
      },
      fields: [optionalLink({ appearances: false })],
    },
    { name: 'subheading', type: 'text', admin: { description: 'Small title above the body copy.' } },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'showIcon',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Show the decorative chevron icon above the body.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'collageImages',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'collage',
        description: 'Three images for the collage: one tall image on the left, two stacked on the right.',
      },
      fields: [
        { name: 'main', type: 'upload', relationTo: 'media', label: 'Tall image (left)' },
        { name: 'topRight', type: 'upload', relationTo: 'media', label: 'Top-right image' },
        { name: 'bottomRight', type: 'upload', relationTo: 'media', label: 'Bottom-right image' },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'secondary',
      options: [
        { label: 'Secondary', value: 'secondary' },
        { label: 'White', value: 'white' },
        { label: 'Primary', value: 'primary' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
