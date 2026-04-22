import type { Block } from 'payload'

export const FeaturedSponsorsBlock: Block = {
  slug: 'featuredSponsors',
  interfaceName: 'FeaturedSponsorsBlockType',
  labels: { singular: 'Featured Sponsors', plural: 'Featured Sponsors' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Meet Our Partners' },
    { name: 'limit', type: 'number', defaultValue: 10, min: 1, max: 40 },
    {
      name: 'featuredOnly',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Only show sponsors marked as "Show on Homepage".' },
    },
  ],
}
