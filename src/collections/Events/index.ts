import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidateEvent, revalidateDeleteEvent } from './hooks/revalidateEvent'
import { syncEventStatus } from './hooks/syncEventStatus'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'date', 'eventStatus', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'eventType',
              type: 'select',
              label: 'Event Type',
              defaultValue: 'ai-watch',
              options: [
                { label: 'AI Watch — Monthly Forum', value: 'ai-watch' },
                { label: 'Nyansa Futures — Conference', value: 'nyansa-futures' },
                { label: 'Beyond the Algorithm — Storytelling', value: 'beyond-the-algorithm' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    width: '50%',
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'isVirtual',
                  type: 'checkbox',
                  label: 'Virtual Event',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              required: true,
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Speakers & Agenda',
          fields: [
            {
              name: 'speakers',
              type: 'array',
              label: 'Speakers',
              admin: {
                initCollapsed: true,
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
            },
            {
              name: 'agenda',
              type: 'array',
              label: 'Agenda',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'time',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Registration',
          fields: [
            {
              name: 'lumaEventUrl',
              type: 'text',
              label: 'Luma Event URL',
              admin: {
                description: 'Link to the Luma event page for registration',
              },
            },
            {
              name: 'lumaEmbedUrl',
              type: 'text',
              label: 'Luma Embed URL',
              admin: {
                description: 'Optional: Luma embed URL for inline registration widget',
              },
            },
            {
              name: 'partnerLogos',
              type: 'relationship',
              label: 'Event Partners',
              relationTo: 'sponsors',
              hasMany: true,
              admin: {
                description: 'Select sponsors/partners associated with this event',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'eventStatus',
      type: 'select',
      label: 'Event Status',
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [syncEventStatus],
    afterChange: [revalidateEvent],
    afterDelete: [revalidateDeleteEvent],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
