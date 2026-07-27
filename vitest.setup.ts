// `test.env` first so it wins, letting tests target a local database without editing .env.
import dotenv from 'dotenv'

dotenv.config({ path: 'test.env' })
dotenv.config()

// With only `.env` loaded, DATABASE_URL is production — `test:int` then reads live data, and
// any future test that writes would mutate it. CI points this at a local postgres service.
const dbUrl = process.env.DATABASE_URL

if (dbUrl) {
  let host = '<unparseable>'
  let dbName = ''

  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    dbName = parsed.pathname
  } catch {
    /* keep the defaults */
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
