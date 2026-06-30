import type { Block } from 'payload'

export const SponsorInquiryFormBlock: Block = {
  slug: 'sponsorInquiryForm',
  interfaceName: 'SponsorInquiryFormBlockType',
  labels: { singular: 'Sponsor Inquiry Form', plural: 'Sponsor Inquiry Forms' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Partner With Us' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'contactEmail',
      type: 'text',
      admin: { description: 'Optional. Shown as a mailto link below the subheading.' },
    },
  ],
}
