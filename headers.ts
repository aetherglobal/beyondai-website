import type { NextConfig } from 'next'

const baselineHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

// Report-only: enforcing blind risks breaking /admin, which needs inline scripts and styles.
// Promote once the console is clean there, adding `upgrade-insecure-requests` at that point.
const buildContentSecurityPolicy = () => {
  const mediaOrigin = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL).origin : ''

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${mediaOrigin} https://www.googletagmanager.com https://www.google-analytics.com`,
    "font-src 'self' data:",
    `connect-src 'self' ${mediaOrigin} https://www.google-analytics.com https://region1.google-analytics.com`,
    "frame-src 'self' https://lu.ma",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ]
    .filter(Boolean)
    .join('; ')
}

export const headers: NextConfig['headers'] = async () => {
  return [
    {
      source: '/:path*',
      headers: [
        ...baselineHeaders,
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        { key: 'Content-Security-Policy-Report-Only', value: buildContentSecurityPolicy() },
      ],
    },
  ]
}
