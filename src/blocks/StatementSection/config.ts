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
