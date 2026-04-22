import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'linkColumns',
      type: 'array',
      label: 'Link Columns',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        description: 'Groups of links shown as columns in the footer.',
        components: {
          RowLabel: '@/Footer/RowLabel#ColumnRowLabel',
        },
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/Footer/RowLabel#RowLabel',
            },
          },
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      admin: {
        description: 'Newsletter block shown in the footer.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Newsletter',
        },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'Subscribe to AI Pulse',
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© {year} Beyond AI. All rights reserved.',
      admin: {
        description: "Use {year} as a placeholder for the current year.",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
