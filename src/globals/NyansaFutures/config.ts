import type { GlobalConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const NyansaFutures: GlobalConfig = {
  slug: 'nyansa-futures',
  label: 'Nyansa Futures Conference',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Nyansa Futures',
            },
            {
              name: 'subheadline',
              type: 'text',
            },
            {
              name: 'description',
              type: 'richText',
              label: 'What is Nyansa Futures',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
            {
              name: 'whyItMatters',
              type: 'richText',
              label: 'Why It Matters',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
            {
              name: 'whoShouldAttend',
              type: 'textarea',
              label: 'Who Should Attend',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Conference Details',
          fields: [
            {
              name: 'format',
              type: 'textarea',
              label: 'Conference Format',
              admin: {
                description: 'e.g., Two-day hybrid conference',
              },
            },
            {
              name: 'keyThemes',
              type: 'array',
              label: 'Key Themes',
              fields: [
                {
                  name: 'theme',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'expectedOutcomes',
              type: 'array',
              label: 'Expected Outcomes',
              fields: [
                {
                  name: 'outcome',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'CTAs & Links',
          fields: [
            {
              name: 'attendUrl',
              type: 'text',
              label: 'Attend Button URL',
            },
            {
              name: 'sponsorUrl',
              type: 'text',
              label: 'Sponsor Button URL',
              admin: {
                description: 'Defaults to /become-a-sponsor if left empty',
              },
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              label: 'Frequently Asked Questions',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
