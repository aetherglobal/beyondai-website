import { postgresAdapter } from '@payloadcms/db-postgres'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// SSL handling for the Postgres pool.
// `pg-connection-string` maps `sslmode=require` to `verify-full` and lets the URL's ssl
// settings override an explicit `ssl` object. That breaks against RDS, whose server cert is
// signed by Amazon's private CA (not in Node's trust store). So when DATABASE_CA_CERT is set,
// we verify against that bundle and strip `sslmode` from the URL so our ssl config wins.
// Without DATABASE_CA_CERT, TLS is governed by the URL: Neon's `verify-full` (public CA) works
// as-is, and RDS-without-verification can use `?sslmode=no-verify`.
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
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
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
      max: 10,
      // Verify the RDS server cert against its private-CA bundle when provided (see above).
      ...(dbCaCert ? { ssl: { ca: dbCaCert, rejectUnauthorized: true } } : {}),
    },
    // Dev/test auto-sync the schema; production & staging rely on migrations (src/migrations/).
    push: process.env.NODE_ENV !== 'production',
  }),
  collections: [Pages, Posts, Events, Media, Categories, Sponsors, GalleryImages, Volunteers, ContactSubmissions, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, NyansaFutures],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
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
