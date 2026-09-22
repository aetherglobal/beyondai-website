# Architecture

Why this codebase is shaped the way it is, and the traps that have already caught someone.
`README.md` covers how to run it; this covers what you need to know before changing it.

## Shape

Payload CMS 3 and Next.js 16 run in one process, one deployment, one database. There is
no separate backend. `src/payload.config.ts` is the root of the CMS; the two Next route
groups split the surfaces:

- `src/app/(frontend)/` — the public site, three custom API routes, the sitemap, and the
  draft-preview endpoints.
- `src/app/(payload)/` — the admin panel and Payload's own REST and GraphQL APIs, all
  generated from the config.

Content is composed, not coded. A page is a hero plus an ordered list of blocks chosen in
the CMS, rendered by `src/blocks/RenderBlocks.tsx`. Adding a section to the site means
adding a block, not editing a page component.

## Data

**PostgreSQL on AWS RDS** in `af-south-1`, connected directly. There is no RDS Proxy, and
that constrains one thing you would otherwise get wrong:

```ts
// src/payload.config.ts
pool: { connectionString: dbConnectionString, max: 3 }
```

Every warm serverless instance holds its own pool, so the fleet-wide connection count is
`max × instances`, not `max`. One invocation serves one request, so a large per-instance
pool buys nothing while bringing the RDS `max_connections` ceiling closer. Raise this only
once a proxy exists.

**The RDS TLS trap.** `pg` maps `sslmode=require` to `verify-full` and lets it override an
explicit `ssl` object, which then fails against RDS's private CA. So: when
`DATABASE_CA_CERT` is set, `sslmode` and `channel_binding` are stripped from the URL and
the cert is passed as an object. Without the cert variable, the URL needs
`?sslmode=no-verify` instead. Both paths are implemented at the top of `payload.config.ts`
and neither is optional.

**`push: true` in development hides migrations.** Payload syncs the schema straight to the
dev database, so `migrate:create` sees nothing to generate and the field works locally and
is missing in production as `column does not exist`. After any schema change, open the
generated migration and confirm it actually contains the change.

**Migrations are manual.** They do not run on deploy. Create, review the SQL, apply to
production, then ship the code. A rollback of the deployment does not roll back a
migration, so keep each one backward compatible with the currently-deployed code —
expand first, contract in a later release.

## Media

Uploads go **browser → S3 directly** via a presigned URL (`clientUploads: true`), so large
files never pass through a serverless function. CloudFront serves them, and
`disablePayloadAccessControl` means the CDN is the origin, not Payload.

Two consequences that look like bugs if you do not know them:

- `generateFileURL` returns an **absolute** CloudFront URL. Anything building a URL from
  media must check whether it is already absolute before prefixing the site origin. This
  is what broke `og:image` on every page for months.
- Under `disablePayloadAccessControl`, Payload skips `generateFileURL` for
  `thumbnailURL`, so `adminThumbnail` has to stay a function — the string form emits a
  dead path in the admin list view.

**SVG is deliberately not an accepted mime type.** Files are served from CloudFront with
their stored `Content-Type`, so an uploaded SVG would execute as script on the media
origin. Never widen `mimeTypes` to `image/*`.

**Vercel's image optimiser is bypassed for CMS media.** The free-tier quota was exhausted
and the site started returning 402s. `src/utilities/payloadImageLoader.ts` is a custom
`next/image` loader that picks the closest of Payload's own stored sizes instead. Do not
re-enable AVIF output and do not widen `deviceSizes` — that is what caused the blowout,
and AVIF additionally widens the surface of the Next.js image advisories.

## Caching

Three layers, and the interaction between them is the part that bites.

1. Next's Data Cache via `unstable_cache`, tagged per collection.
2. Payload `afterChange` hooks calling `revalidateTag` / `revalidatePath`.
3. CloudFront in front of media only.

**Every `unstable_cache` call must pass `revalidate: CACHE_TTL_SECONDS`** from
`src/blocks/_data/cache.ts`. The Data Cache survives deploys, so without a TTL a single
missed or misnamed `revalidateTag` freezes that content *permanently* — not until the next
deploy, forever. Three call sites were missing it.

**The cache key must include every argument that changes the result.** `getCachedGlobal`
keyed on the slug alone while being called at two different `depth` values, so the header
and footer shared one entry and whichever rendered first decided whether relations were
populated at all. Symptoms of this class of bug are non-deterministic and look like a CMS
data problem.

## Two redirect systems

`redirects.ts` (build-time, in `next.config.ts`) and the CMS Redirects collection both
exist, and **the build-time ones shadow the CMS rows** — Next applies its config redirects
before the app ever runs. Legacy WordPress URLs live in `redirects.ts`; editor-managed
redirects go in the CMS.

Create CMS redirect rows **through the production admin panel**, not with a local script.
The `revalidateRedirects` hook owns the cache tag, and a script writing directly to the
database leaves the cache stale.

The site ran on WordPress until roughly April 2026 and old URLs are still indexed — but
about 174 of them are theme-demo junk that must keep returning 404. Do not add a redirect
unless a genuine equivalent page exists; a redirect to something that does not serve the
same need is a soft 404.

## Access control

`src/access/` is the whole model, and it is small on purpose:

- `anyone` — public read, and create on the two submission collections.
- `authenticated` — any logged-in CMS user.
- `authenticatedOrPublished` — anonymous callers see only `_status: published`.
- `isAdmin` / `isAdminOrSelf` / `isAdminField` — role-gated.

Two accounts types: **admin** and **editor**. Editors manage content. Admins additionally
manage users and read `contact-submissions` and `volunteers`, which hold the public's
personal data. `isAdminField` on the `role` field is what stops an editor promoting
themselves, since `isAdminOrSelf` otherwise lets them update their own document.

Payload's REST API is generated from these same functions, so `GET /api/pages` is public
because `pages.read` is `authenticatedOrPublished`. There is no separate API layer to
secure — the collection config *is* the API contract. `maxDepth: 3` and per-collection
limits bound what a public query can ask for.

## CSS gotcha

Lightning CSS with the default browserslist **strips bare `svh`/`dvh`/`lvh`** from custom
properties, which silently yields a zero-height hero. Modern viewport units must be gated
behind `@supports`, as `--hero-h` is in `globals.css`. Do not "simplify" that block.

## Dates

`src/utilities/formatEventDate.ts` pins event formatting to `Africa/Accra`. This matters
even though Ghana is UTC+0 and Vercel runs UTC: those two facts are what made seven
hand-rolled `toLocaleDateString` calls accidentally correct, and the accident ends the
moment any of them renders on a client or the org runs an event elsewhere.

## Observability

Sentry on the server, edge and client, all inert without a DSN, configured to drop request
bodies, cookies and authorization headers — form submissions are other people's personal
data. Vercel Analytics and Speed Insights are cookieless and consent-exempt, and are the
only source of field Core Web Vitals.

CSP violations POST to `/api/csp-report`. The policy is still `Report-Only` by design:
enforcing it blind would break `/admin`, which needs inline scripts and `unsafe-eval`. The
path to promotion is to read the reports, then give `/admin` its own looser policy via a
second `source` entry in `headers.ts` so the public site can drop `unsafe-eval`.

## Known ceilings

Deliberate simplifications, with the upgrade path:

| Where | Ceiling | Upgrade when |
|---|---|---|
| `src/utilities/submissionGuard.ts` | Rate limit is per-instance and in-memory, so it is a speed bump | Spam gets through the Vercel WAF rule; swap in `@upstash/ratelimit` |
| `src/collections/Users/hooks/enforcePasswordPolicy.ts` | Cannot police the forgot-password flow; Payload hashes before hooks run and passes the stored doc | Self-service reset is opened beyond staff |
| `pool.max: 3` | Fleet connections still scale with instance count | Traffic warrants an RDS Proxy |
| Password hashing | Payload's local strategy is PBKDF2-SHA256 at 25,000 iterations, below current guidance, and not configurable | Payload exposes a work factor, or a custom auth strategy becomes worthwhile |
| CSP | Enforced policy is `frame-ancestors` only | The report endpoint shows the full policy is clean |
