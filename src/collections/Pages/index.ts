import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { SplitContent } from '../../blocks/SplitContent/config'
import { StatementSection } from '../../blocks/StatementSection/config'
import { ObjectivesGrid } from '../../blocks/ObjectivesGrid/config'
import { ProgramsGrid } from '../../blocks/ProgramsGrid/config'
import { StatsRow } from '../../blocks/StatsRow/config'
import { TimelineSteps } from '../../blocks/TimelineSteps/config'
import { RolesList } from '../../blocks/RolesList/config'
import { TestimonialList } from '../../blocks/TestimonialList/config'
import { FAQBlock } from '../../blocks/FAQBlock/config'
import { ContactInfoBlock } from '../../blocks/ContactInfoBlock/config'
import { UpcomingEventsBlock } from '../../blocks/UpcomingEventsBlock/config'
import { FeaturedEventBlock } from '../../blocks/FeaturedEventBlock/config'
import { PastEventsBlock } from '../../blocks/PastEventsBlock/config'
import { LatestArticlesBlock } from '../../blocks/LatestArticlesBlock/config'
import { FeaturedSponsorsBlock } from '../../blocks/FeaturedSponsorsBlock/config'
import { NewsletterFormBlock } from '../../blocks/NewsletterFormBlock/config'
import { ContactFormBlock } from '../../blocks/ContactFormBlock/config'
import { VolunteerFormBlock } from '../../blocks/VolunteerFormBlock/config'
import { SponsorInquiryFormBlock } from '../../blocks/SponsorInquiryFormBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
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
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
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
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                SplitContent,
                StatementSection,
                ObjectivesGrid,
                ProgramsGrid,
                StatsRow,
                TimelineSteps,
                RolesList,
                TestimonialList,
                FAQBlock,
                ContactInfoBlock,
                UpcomingEventsBlock,
                FeaturedEventBlock,
                PastEventsBlock,
                LatestArticlesBlock,
                FeaturedSponsorsBlock,
                NewsletterFormBlock,
                ContactFormBlock,
                VolunteerFormBlock,
                SponsorInquiryFormBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
