import type { Block } from 'payload'

export const NewsletterFormBlock: Block = {
  slug: 'newsletterForm',
  interfaceName: 'NewsletterFormBlockType',
  labels: { singular: 'Newsletter Form', plural: 'Newsletter Forms' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Subscribe to AI Pulse' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full', value: 'full' },
        { label: 'Compact', value: 'compact' },
      ],
    },
  ],
}
