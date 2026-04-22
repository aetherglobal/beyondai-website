import type { Block } from 'payload'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlockType',
  labels: { singular: 'Contact Info', plural: 'Contact Info' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'showEmail',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Pulled from Site Settings > Contact Info.' },
    },
    { name: 'showPhone', type: 'checkbox', defaultValue: true },
    { name: 'showAddress', type: 'checkbox', defaultValue: true },
  ],
}
