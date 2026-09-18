import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Events } from './collections/Events'
import { GalleryImages } from './collections/GalleryImages'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { Sponsors } from './collections/Sponsors'
import { Users } from './collections/Users'
import { Volunteers } from './collections/Volunteers'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { NyansaFutures } from './globals/NyansaFutures/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { assertEnv } from './utilities/requireEnv'

assertEnv()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || ''
const dbCaCert = process.env.DATABASE_CA_CERT
const dbConnectionString =
  dbCaCert && databaseUrl
    ? (() => {
        try {
          const u = new URL(databaseUrl)
          u.searchParams.delete('sslmode')
          u.searchParams.delete('channel_binding')
          return u.toString()
        } catch {
          return databaseUrl
        }
      })()
    : databaseUrl

export default buildConfig({
  onInit: async (payload) => {
    payload.db.bulkOperationsSingleTransaction = true
  },
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: dbConnectionString,
      max: 3,
      ...(dbCaCert ? { ssl: { ca: dbCaCert, rejectUnauthorized: true } } : {}),
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  collections: [Pages, Posts, Events, People, Media, Categories, Sponsors, GalleryImages, Volunteers, ContactSubmissions, Users],
  cors: [getServerSideURL()].filter(Boolean),
  maxDepth: 3,
  serverURL: getServerSideURL(),
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
    abortOnLimit: true,
  },
  globals: [Header, Footer, SiteSettings, NyansaFutures],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'info@beyondai.africa',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Beyond AI',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
