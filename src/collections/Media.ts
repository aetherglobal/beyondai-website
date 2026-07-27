import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    // Enumerated, not `image/*`: that wildcard admits `image/svg+xml`, and SVGs carry script.
    // Files are served straight from CloudFront with whatever Content-Type S3 stored, so one
    // would execute on the media origin.
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/heic',
      'image/heif',
      'application/pdf',
    ],
    // Size ceiling lives on the top-level config's `upload` — collection UploadConfig has no
    // `limits`. And under `disablePayloadAccessControl` Payload skips `generateFileURL` for
    // `thumbnailURL`, so the string form emits a dead `/api/media/file/...` path; build the
    // CloudFront URL here instead, falling back to the size name when S3 is unconfigured.
    adminThumbnail: process.env.S3_PUBLIC_URL
      ? ({ doc }) => {
          const sizes = doc?.sizes as { thumbnail?: { filename?: string | null } } | undefined
          const filename = sizes?.thumbnail?.filename ?? (doc?.filename as string | null)
          if (!filename) return null
          const prefix = doc?.prefix ? `${doc.prefix as string}/` : ''
          return `${process.env.S3_PUBLIC_URL}/${prefix}${filename}`
        }
      : 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
