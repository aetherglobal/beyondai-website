import type { Block } from 'payload'

export const SponsorInquiryFormBlock: Block = {
  slug: 'sponsorInquiryForm',
  interfaceName: 'SponsorInquiryFormBlockType',
  labels: { singular: 'Sponsor Inquiry Form', plural: 'Sponsor Inquiry Forms' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Partner With Us' },
    { name: 'subheading', type: 'textarea' },
  ],
}
