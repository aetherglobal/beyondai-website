import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import { anyone } from '../../access/anyone'

export const ContactSubmissions: CollectionConfig<'contact-submissions'> = {
  slug: 'contact-submissions',
  access: {
    create: anyone,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
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
      maxLength: 120,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'organization',
      type: 'text',
      maxLength: 200,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sponsor-inquiry',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
      maxLength: 150,
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
        { label: 'Collaboration', value: 'collaboration' },
        { label: 'Media Partnership', value: 'media-partnership' },
        { label: 'In-Kind Support', value: 'in-kind-support' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sponsor-inquiry',
      },
    },
  ],
}
