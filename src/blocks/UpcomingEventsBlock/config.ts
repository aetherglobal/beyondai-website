import type { Block } from 'payload'

export const UpcomingEventsBlock: Block = {
  slug: 'upcomingEvents',
  interfaceName: 'UpcomingEventsBlockType',
  labels: { singular: 'Upcoming Events', plural: 'Upcoming Events' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Upcoming Events' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'View All Events' },
    { name: 'ctaHref', type: 'text', defaultValue: '/events' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid of event cards', value: 'grid' },
        { label: 'Numbered list (dark background)', value: 'numberedList' },
      ],
    },
    {
      name: 'skipFirst',
      type: 'checkbox',
      label: 'Skip first upcoming event',
      defaultValue: false,
      admin: {
        description:
          'When enabled, the first upcoming event is skipped (useful when a Featured Event block is rendering it above).',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 20,
    },
  ],
}
