// Any setup scripts you might need go here

// Load .env files. `test.env` is applied first so it wins where it defines a value, letting
// tests be pointed at a local database without touching .env — see the safety check below.
import dotenv from 'dotenv'

dotenv.config({ path: 'test.env' })
dotenv.config()

// The integration tests open a real Payload/Postgres connection using DATABASE_URL. With
// only `.env` loaded that is the production database, so `bun run test:int` reads live data
// — and any future test that writes would mutate it. Warn loudly; set DATABASE_URL in
// `test.env` (CI points it at a local postgres service) to silence this.
const dbUrl = process.env.DATABASE_URL

if (dbUrl) {
  let host = '<unparseable>'
  let dbName = ''

  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    dbName = parsed.pathname
  } catch {
    // leave the defaults
  }

  const looksLocal = /^(localhost|127\.0\.0\.1|::1|postgres)$/.test(host)
  const looksLikeTestDb = /test/i.test(dbName)

  if (!looksLocal && !looksLikeTestDb) {
    console.warn(
      `\n  WARNING: integration tests are pointed at a NON-LOCAL database (${host}).` +
        `\n  Reads hit live data, and a write-test would mutate it.` +
        `\n  Set DATABASE_URL in test.env to use a local/test database.\n`,
    )
  }
}
