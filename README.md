# Beyond AI Initiative

The website for the Beyond AI Initiative — a civic platform for AI governance and digital
transformation in Africa. Production: **https://beyondai.africa**

Next.js 16 and Payload CMS 3 run together in a single deployment. The public site is at
`/`, the CMS admin at `/admin`. `REQUIREMENTS.md` holds the feature specification;
`ARCHITECTURE.md` explains how the pieces fit and where the sharp edges are.

## Getting started

Requires Node ≥ 20.9, [Bun](https://bun.sh), and a local PostgreSQL 16.

```bash
createdb beyond_ai                      # or `docker run -p 5432:5432 postgres:16`
cp .env.example .env                    # then fill in DATABASE_URL and PAYLOAD_SECRET
bun install
bun dev                                 # http://localhost:3000
```

The app refuses to start when a required variable is missing and names the one it wants,
so work from the error rather than guessing. Every variable is documented in
`.env.example`.

> **Point `DATABASE_URL` at a local database.** The `.env` on a maintainer's machine has
> historically pointed at production RDS. The test suites now refuse to run against a
> non-local, non-test database for exactly that reason, but `bun dev` will happily
> connect — and in development Payload has `push: true`, so it writes schema changes to
> whatever it is pointed at.

There is no seed script. The site's content lives in the database; create a first admin
user through `/admin` on a fresh local database.

## Commands

| Command | What it does |
|---|---|
| `bun dev` | Dev server with hot reload |
| `bun run build` | Production build (Next.js + Payload) |
| `bun start` | Serve a production build |
| `bun lint` | ESLint, failing on warnings |
| `npx tsc --noEmit` | Type check |
| `bun run test:int` | Vitest integration tests |
| `bun run test:e2e` | Playwright E2E (Chromium) |
| `bun test` | Both suites |
| `bun payload generate:types` | Regenerate `src/payload-types.ts` after a schema change |
| `bun payload generate:importmap` | Regenerate the admin import map after adding an admin component |
| `bun payload migrate:create` | Create a migration |
| `bun payload migrate` | Apply pending migrations |

## Deployment

Vercel, from `main`. The branch flow is **`dev` → `staging` → `main`**, and
`.github/workflows/deploy-check.yml` rejects any PR to `main` that does not come from
`staging`.

Backing services:

- **Database** — PostgreSQL on AWS RDS (`af-south-1`). Connected directly, with no RDS
  Proxy, so the connection pool is deliberately small; see `ARCHITECTURE.md`.
- **Media** — S3 with a CloudFront distribution in front. Uploads go straight from the
  browser to S3 via a presigned URL, and Payload's own stored image sizes are served
  through a custom `next/image` loader rather than Vercel's optimiser.
- **Newsletter** — Mailchimp, double opt-in.
- **Event registration** — Luma, embedded or linked per event.

### Migrations

Migrations are **not** run automatically on deploy. Create one, review the generated SQL,
apply it to production, then deploy the code:

```bash
bun payload migrate:create describe_the_change
printf 'y\n' | bun payload migrate      # the prompt needs a piped confirmation
```

In development `push: true` syncs the schema without generating a migration, which means
a new field can work locally and be missing in production. After any schema change,
confirm the migration actually captures it before merging.

### Required Vercel configuration

- Every variable in `.env.example` that has no default.
- `CRON_SECRET` must be set, or the cron in `vercel.json` cannot run scheduled
  publishing — Vercel passes it as a bearer token automatically when present.
- A WAF rate-limit rule on `/api/*`. The application has a small in-process throttle, but
  on serverless each instance counts separately; the edge rule is the real limit.

## Architecture at a glance

```
src/
  app/(frontend)/   public site, custom API routes, sitemap, preview
  app/(payload)/    admin panel and Payload's REST + GraphQL API
  collections/      Pages, Posts, Events, People, Media, Categories, Sponsors,
                    GalleryImages, Volunteers, ContactSubmissions, Users
  globals/          SiteSettings, NyansaFutures  (Header and Footer live in src/Header, src/Footer)
  blocks/           layout-builder blocks; config.ts is the schema, Component.tsx renders
  heros/            hero variants selected per page
  access/           access-control functions — start here for anything permissions-related
  fields/           reusable field configs (link, linkGroup, validateUrlField)
  utilities/        shared helpers
  migrations/       generated, ordered, committed
```

Pages and posts are composed in the CMS from blocks, so adding a section means adding a
block (`config.ts` + `Component.tsx`) and registering it in `RenderBlocks.tsx` — not
editing a page component.

### Conventions worth knowing before you change anything

- **Always pass `req`** to nested Payload operations inside hooks, or they run outside the
  surrounding transaction.
- **Set `overrideAccess: false`** when passing `user` to a Local API call.
- Run `generate:types` after any collection or global change, and `generate:importmap`
  after adding or moving an admin component.
- Admin components are referenced by **file path string**, not by import.
- Use `context` flags to stop revalidation hooks looping.
- Every `unstable_cache` call must pass `revalidate: CACHE_TTL_SECONDS` from
  `src/blocks/_data/cache.ts`. The Data Cache survives deploys, so a missed
  `revalidateTag` without a TTL freezes content permanently.
- Dates shown to users go through `src/utilities/formatEventDate.ts`, which pins the
  timezone to `Africa/Accra`. Do not hand-roll `toLocaleDateString`.
- CMS-authored URLs go through `resolveLinkHref` / `validateUrlField`. Do not put a raw
  CMS string into an `href` or an `iframe src`.

## Security

Report a vulnerability privately — see `SECURITY.md`. Do not open a public issue.
