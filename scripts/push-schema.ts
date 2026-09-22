import { getPayload } from 'payload'

import config from '../src/payload.config.js'
import { assertTestDatabase } from '../tests/helpers/assertTestDatabase'

if (process.env.NODE_ENV === 'production') {
  throw new Error(
    'push-schema is for local and CI databases only. Production schema changes go through `payload migrate`.',
  )
}

assertTestDatabase('push-schema')

const payload = await getPayload({ config })

const { totalDocs } = await payload.count({ collection: 'pages' })

payload.logger.info(`Schema pushed. pages=${totalDocs}`)
process.exit(0)
