import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { slugField } from 'payload'

export const Sponsors: CollectionConfig<'sponsors'> = {
  slug: 'sponsors',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    logo: true,
    type: true,
  },
  admin: {
    defaultColumns: ['name', 'type', 'featured', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Website URL',
      admin: {
        description: 'External website link for the sponsor/partner',
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'sponsor',
      options: [
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Knowledge Partner', value: 'knowledge-partner' },
        { label: 'Community Partner', value: 'community-partner' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display this sponsor on the homepage',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    slugField(),
  ],
}
