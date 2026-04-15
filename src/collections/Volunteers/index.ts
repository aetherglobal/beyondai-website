import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Volunteers: CollectionConfig<'volunteers'> = {
  slug: 'volunteers',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'city', 'country', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
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
      name: 'phone',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'areasOfInterest',
      type: 'select',
      hasMany: true,
      label: 'Areas of Interest',
      options: [
        { label: 'Event Support', value: 'event-support' },
        { label: 'Research and Writing', value: 'research-writing' },
        { label: 'Media and Communications', value: 'media-communications' },
        { label: 'Community Outreach', value: 'community-outreach' },
        { label: 'Logistics', value: 'logistics' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
  ],
}
