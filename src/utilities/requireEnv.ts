const REQUIRED = ['DATABASE_URL', 'PAYLOAD_SECRET'] as const
const REQUIRED_WITH_S3 = ['S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_REGION', 'S3_PUBLIC_URL']

export function assertEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim())

  if (process.env.S3_BUCKET?.trim()) {
    missing.push(...(REQUIRED_WITH_S3.filter((key) => !process.env[key]?.trim()) as never[]))
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        `See .env.example for the full list.`,
    )
  }
}
