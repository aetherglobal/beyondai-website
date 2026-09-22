# Changelog

Notable changes to the Beyond AI website. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Security

- Removed the `/next/seed` endpoint, its seed data and the admin dashboard button that
  triggered it. One click by any logged-in CMS user deleted every page, post, image,
  category, CMS form and form submission on the live site, with no confirmation.
- Upgraded Next.js 16.2.3 → 16.3.5, clearing two critical advisories (including an
  unauthenticated RCE in the Image Optimization API reachable because AVIF uploads are
  permitted) and ten high ones.
- Upgraded sharp 0.34.2 → 0.35.4 for the libvips and libheif advisories, reachable via
  HEIC/HEIF/AVIF media uploads.
- Fixed a dead authorization check in the draft-preview endpoint: `payload.auth()`
  returns an always-truthy object, so `if (!user)` never fired and a leaked
  `PREVIEW_SECRET` was the only gate on unpublished content. **Rotate `PREVIEW_SECRET`.**
- Added roles to Users. Every account was previously a superadmin able to create other
  accounts and read all submissions; editors are now content-only, and contact and
  volunteer records are admin-only.
- Enforced a 15-character minimum password (NIST SP 800-63B Rev 4), replacing Payload's
  three-character default. No composition rules and no expiry, per the same standard.
- Added rate limiting, honeypots, body-size caps, email validation and field length caps
  to the three public POST endpoints, which previously had none.
- Sanitised CMS theme values before they are injected into a `<style>` block, and added
  scheme validation to every CMS URL field plus a host pin on the Luma embed.
- Added a CSP violation collector so the report-only policy can be promoted from real
  data, and `includeSubDomains` to HSTS.
- Test suites now refuse to run against a non-local database instead of warning and
  proceeding. The E2E suite had no guard at all while creating and deleting users.

### Added

- `Event`, `Article`, `Organization` and `WebSite` JSON-LD. The site had no structured
  data at all.
- Email delivery via SMTP, so password resets work and form submissions are actually
  sent to the team. Payload's fallback adapter had been resolving successfully and
  sending nothing.
- A Vercel cron for Payload's job queue. `schedulePublish` was enabled in the CMS with
  nothing to run it, so scheduled posts silently never published.
- Sentry error reporting and Vercel Analytics / Speed Insights.
- `<main>` landmark, skip link, live-region form announcements, `autocomplete`
  attributes, a carousel pause control and 24×24 hit areas.
- Error and loading boundaries (`error.tsx`, `global-error.tsx`, `loading.tsx`).
- `scripts/erase-subject.ts` — deletes one person's data across all three collections
  and Mailchimp in one pass, for a GDPR Art. 17 request.
- A cookie-preferences link in the footer, so consent can be withdrawn as easily as it
  was given.
- Tests for the submission guard, access rules, password policy, metadata generation and
  event date formatting.
- `README.md`, `ARCHITECTURE.md`, `SECURITY.md`, `LICENSE`, this changelog, and
  Dependabot.

### Fixed

- `og:image` was `https://beyondai.africahttps//d11rlz...cloudfront.net/...` on every
  page — the site origin was concatenated onto an already-absolute CloudFront URL, so
  every share card on every platform was broken. Added a default share image too.
- `getCachedGlobal` omitted `depth` from its cache key, so the header (depth 1) and
  footer (depth 0) shared one entry and whichever ran first decided whether the CMS logo
  and favicon resolved at all.
- Three `unstable_cache` call sites had no TTL, against the rule written in this
  codebase's own comment, leaving header, footer, redirects and sitemaps able to freeze
  permanently on a missed `revalidateTag`.
- Event times were formatted in seven places with no timezone, correct only because
  Vercel runs UTC and Accra is UTC+0.
- Newsletter sign-up used Mailchimp `subscribed` (single opt-in) with no consent record;
  now `pending`, so Mailchimp's confirmation creates the audit trail. All four forms now
  carry a privacy notice at the point of collection.
- The author lookup issued one query per author on every post read, inside an
  `afterRead` hook, without `req`, swallowing every error.
- Contrast: `--primary-deep` was 4.36:1 as body text, `--input` borders 1.27:1.
- Renaming a published post no longer leaves a stale page at the old URL.
- `robots.txt` now excludes `/api/*`, which was serving indexable JSON of every page.

### Changed

- Connection pool 10 → 3 per instance. Each warm serverless instance holds its own pool,
  so the fleet total was `10 × instances` against RDS with no proxy.
- Draft autosave 100ms → 1000ms, and `maxDepth` capped at 3.
- CI now builds, runs E2E, audits dependencies, and pins actions to commit SHAs.

### Removed

- `Dockerfile` and `docker-compose.yml`. Both were dead: the Dockerfile documented its
  own inoperability, and the compose file stood up MongoDB for a PostgreSQL project while
  mounting the production `.env` into the container.
- The Payload template's `BeforeDashboard` and `BeforeLogin` components, which showed
  template onboarding copy to the client in the production admin panel.
- `@vercel/blob`, `autoprefixer` and `@types/escape-html` — unused.
- `FadeIn`'s framer-motion implementation, now a thin alias over the CSS `Reveal`.

### Not fixed, and why

- **The migration chain is not reproducible from an empty database.** The initial schema
  came from dev `push: true` and was never captured, so the oldest migration assumes
  tables no migration creates. `scripts/push-schema.ts` works around it for CI and local
  setup, but the real fix is a baseline migration capturing the current production
  schema — which needs to be written against a production dump, not guessed. This was
  understated as a Question in the audit; it is a real finding.
- **Password reset cannot be policed.** `enforcePasswordPolicy` covers create and update,
  but Payload 3.83 hashes in `resetPassword.js:56` before hooks run and passes the stored
  document rather than the submitted payload, so the plaintext never reaches a hook.
  Closing it needs a custom reset endpoint.
- **Two nodemailer advisories remain.** `@payloadcms/email-nodemailer` pins nodemailer to
  an exact 7.0.12; neither advisory is reachable from how we call it, and both are
  explicitly ignored in CI with that reasoning recorded. Re-check when Payload bumps.
- **Password hashing is still PBKDF2-SHA256 at 25,000 iterations.** Payload's local
  strategy hardcodes it with no configuration hook. Mitigated by the 15-character
  minimum; a real fix needs a custom auth strategy.
