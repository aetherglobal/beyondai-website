import dotenv from 'dotenv'

dotenv.config({ path: 'test.env' })
dotenv.config()

const dbUrl = process.env.DATABASE_URL

if (dbUrl) {
  let host = '<unparseable>'
  let dbName = ''

  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    dbName = parsed.pathname
  } catch {}

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
