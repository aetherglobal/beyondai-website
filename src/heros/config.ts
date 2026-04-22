import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Featured Event', value: 'featuredEvent' },
        { label: 'Page Hero', value: 'pageHero' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) =>
            ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'pageHero'].includes(type),
      },
      relationTo: 'media',
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['featuredEvent', 'pageHero'].includes(type),
        description:
          'Small label shown above the title (e.g. "Govern / Innovate / Transform" or "[Events]").',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'featuredEvent',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Main heading. Line breaks are preserved.',
      },
    },
    {
      name: 'headingAccent',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Optional final line of the heading rendered in the accent color.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => ['featuredEvent', 'pageHero'].includes(type),
      },
    },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      admin: {
        condition: (_, { type } = {}) => ['featuredEvent', 'pageHero'].includes(type),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Internal path (e.g. /events) or external URL.' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        {
          name: 'useEventLumaUrl',
          type: 'checkbox',
          label: 'Use next event Luma URL',
          defaultValue: false,
          admin: {
            description:
              "If enabled and an upcoming event is found, this button links to that event's Luma URL.",
          },
        },
      ],
    },
    {
      name: 'bindNextEvent',
      type: 'checkbox',
      label: 'Show next upcoming event',
      defaultValue: true,
      admin: {
        condition: (_, { type } = {}) => type === 'featuredEvent',
        description: 'Displays date, location and countdown for the next upcoming event.',
      },
    },
    {
      name: 'fallbackImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'featuredEvent',
        description: 'Shown when no upcoming event exists or when binding is disabled.',
      },
    },
  ],
  label: false,
}
