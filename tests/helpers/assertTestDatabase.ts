const LOCAL_HOSTS = /^(localhost|127\.0\.0\.1|::1|postgres|host\.docker\.internal)$/

export function assertTestDatabase(context: string): void {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error(
      `${context}: DATABASE_URL is not set. Point it at a local or test database — see .env.example.`,
    )
  }

  let host = '<unparseable>'
  let dbName = ''

  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    dbName = parsed.pathname
  } catch {
    throw new Error(`${context}: DATABASE_URL could not be parsed.`)
  }

  const looksLocal = LOCAL_HOSTS.test(host)
  const looksLikeTestDb = /test/i.test(dbName)

  if (looksLocal || looksLikeTestDb) return

  throw new Error(
    `\n${context}: refusing to run against a non-local database.\n\n` +
      `  host:     ${host}\n` +
      `  database: ${dbName || '(none)'}\n\n` +
      `  The suite creates and deletes records. Point DATABASE_URL at a local database,\n` +
      `  or one whose name contains "test", before running it.\n`,
  )
}
