import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { revalidateDeleteGallery, revalidateGallery } from './hooks/revalidateGallery'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: {
    singular: 'Gallery Image',
    plural: 'Gallery Images',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    image: true,
    caption: true,
    event: true,
  },
  admin: {
    defaultColumns: ['caption', 'event', 'sortOrder', 'updatedAt'],
    useAsTitle: 'caption',
  },
  hooks: {
    afterChange: [revalidateGallery],
    afterDelete: [revalidateDeleteGallery],
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Short description of the photo',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'The event this photo is from',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured images appear larger in the gallery grid',
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
  ],
}
