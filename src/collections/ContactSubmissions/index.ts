import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const ContactSubmissions: CollectionConfig<'contact-submissions'> = {
  slug: 'contact-submissions',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'source', 'subject', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      defaultValue: 'contact-form',
      options: [
        { label: 'Contact Form', value: 'contact-form' },
        { label: 'Sponsor Inquiry', value: 'sponsor-inquiry' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'organization',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sponsor-inquiry',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sponsor-inquiry',
      },
    },
    {
      name: 'partnershipInterest',
      type: 'select',
      label: 'Partnership Interest',
      options: [
        { label: 'Sponsorship', value: 'sponsorship' },
        { label: 'Knowledge Partnership', value: 'knowledge-partnership' },
        { label: 'Community Partnership', value: 'community-partnership' },
        { label: 'In-Kind Support', value: 'in-kind-support' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sponsor-inquiry',
      },
    },
  ],
}
