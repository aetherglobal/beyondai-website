import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { revalidateDeletePerson, revalidatePerson } from './hooks/revalidatePerson'

export const People: CollectionConfig<'people'> = {
  slug: 'people',
  labels: {
    singular: 'Person',
    plural: 'People',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidatePerson],
    afterDelete: [revalidateDeletePerson],
  },
  defaultPopulate: {
    name: true,
    title: true,
    photo: true,
  },
  admin: {
    defaultColumns: ['name', 'title', 'updatedAt'],
    useAsTitle: 'name',
    description:
      'Speakers and hosts, created once and reused across any number of events. Editing a person here updates every event they appear on.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title / Role',
      admin: {
        description:
          'Their usual title. An individual event can override this with a per-event role.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
