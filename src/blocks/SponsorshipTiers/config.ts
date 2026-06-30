import type { Block } from 'payload'

export const SponsorshipTiers: Block = {
  slug: 'sponsorshipTiers',
  interfaceName: 'SponsorshipTiersBlock',
  labels: { singular: 'Sponsorship Tiers', plural: 'Sponsorship Tiers' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'White', value: 'white' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Tier', plural: 'Tiers' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'amount',
          type: 'text',
          admin: { description: 'e.g. "GHS 250,000+"' },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Emphasise this tier (accent border).' },
        },
        {
          name: 'features',
          type: 'array',
          minRows: 1,
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'feature', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Optional note shown below the tiers.' },
    },
  ],
}
