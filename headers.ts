import type { NextConfig } from 'next'

const baselineHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/**
 * Report-only to begin with: the Payload admin and Next's hydration runtime both need
 * inline scripts and styles, so enforcing blind risks breaking `/admin`. Promote to
 * `Content-Security-Policy` once the console is clean on both the frontend and `/admin`,
 * and add `upgrade-insecure-requests` at that point — browsers ignore it in a report-only
 * policy and warn on every page load.
 */
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
        // Enforced ahead of the rest of the policy: this is what stops clickjacking on /admin.
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        { key: 'Content-Security-Policy-Report-Only', value: buildContentSecurityPolicy() },
      ],
    },
  ]
}
