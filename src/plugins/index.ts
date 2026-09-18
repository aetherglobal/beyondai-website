import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Field, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { normalizeRedirectPath } from '@/utilities/normalizeRedirectPath'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Event, Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page | Event> = ({ doc }) => {
  return doc?.title ? `Beyond AI | ${doc.title}` : 'Beyond AI'
}

const generateURL: GenerateURL<Post | Page | Event> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  s3Storage({
    enabled: Boolean(process.env.S3_BUCKET),
    clientUploads: true,
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) =>
          `${process.env.S3_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
      },
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
    },
  }),
  redirectsPlugin({
    collections: ['pages', 'posts', 'events'],
    overrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description:
                  'A path on this site, e.g. /nyansa2026. Paste a full URL and it is trimmed to its path. Saved changes go live immediately — no rebuild needed.',
              },
              hooks: {
                beforeValidate: [
                  ({ value }: { value?: unknown }) =>
                    typeof value === 'string' ? normalizeRedirectPath(value) : value,
                ],
              },
            }
          }
          return field
        }) as Field[]
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: ['posts', 'events'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
