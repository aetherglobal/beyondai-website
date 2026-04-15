# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beyond AI Initiative website — a Next.js 16 + Payload CMS 3 application using PostgreSQL. The site is a civic platform for AI governance in Africa, featuring events, articles, newsletter, conference pages, and sponsor/volunteer forms. See `REQUIREMENTS.md` for full feature spec.

## Commands

```bash
bun dev                  # Start dev server (localhost:3000)
bun run build             # Production build (Next.js + Payload)
bun start                # Serve production build
bun lint                 # ESLint check
bun lint:fix             # ESLint autofix
bun run test:int             # Integration tests (Vitest, tests/int/**/*.int.spec.ts)
bun run test:e2e             # E2E tests (Playwright, tests/e2e/)
bun test                 # Run both int + e2e
bun payload generate:types       # Regenerate payload-types.ts after schema changes
bun payload generate:importmap   # Regenerate import map after creating/modifying admin components
bun payload migrate:create       # Create a new database migration
bun payload migrate              # Run pending migrations
```

Type-check without emitting: `npx tsc --noEmit`

## Architecture

### Payload CMS + Next.js (single instance)

Payload and Next.js run together in one server. The Payload admin panel is at `/admin`, the frontend website at `/`.

**Config entry:** `src/payload.config.ts` — defines collections, globals, plugins, database adapter (Postgres), and jobs.

### Route Groups

- `src/app/(frontend)/` — Public website routes (pages, posts, search, sitemaps)
- `src/app/(payload)/` — Payload admin panel and API routes (`/admin`, `/api/*`, `/api/graphql`)

### Collections

| Collection | Purpose |
|-----------|---------|
| Pages | CMS-managed pages with layout builder (hero + blocks) and draft/publish workflow |
| Posts | Blog/articles with Lexical rich text, categories, authors, draft/publish |
| Media | Upload collection for images/assets with focal point support |
| Categories | Taxonomy with nested docs support |
| Users | Auth-enabled, access to admin panel |

### Globals

- **Header** — Nav links
- **Footer** — Footer nav and content

### Plugins

Configured in `src/plugins/index.ts`:
- `redirectsPlugin` — URL redirects
- `nestedDocsPlugin` — Category nesting
- `seoPlugin` — SEO meta fields on pages/posts
- `formBuilderPlugin` — CMS-managed forms (payment disabled)
- `searchPlugin` — Search indexing for posts

### Layout Builder Pattern

Pages use a `layout` blocks field with these block types: `CallToAction`, `Content`, `MediaBlock`, `Archive`, `FormBlock`. Posts use inline Lexical blocks: `Banner`, `Code`, `MediaBlock`. Block configs live in `src/blocks/*/config.ts`, components in `src/blocks/*/Component.tsx`.

Rendered via `src/blocks/RenderBlocks.tsx`.

### Hero System

Pages have a hero field with variants: `HighImpact`, `MediumImpact`, `LowImpact`. Config at `src/heros/config.ts`, rendered by `src/heros/RenderHero.tsx`.

### Key Directories

- `src/access/` — Access control functions (`authenticated`, `anyone`, `authenticatedOrPublished`)
- `src/hooks/` — Shared hooks (e.g., `populatePublishedAt`, `revalidateRedirects`)
- `src/fields/` — Reusable field configs (`defaultLexical`, `link`, `linkGroup`)
- `src/components/ui/` — shadcn/ui components
- `src/utilities/` — Shared utilities (URL helpers, meta generation, etc.)
- `src/providers/` — React context providers (Theme, HeaderTheme)
- `src/search/` — Search sync hooks and field overrides
- `src/endpoints/seed/` — Database seeding data

### Path Aliases

- `@/*` → `src/*`
- `@payload-config` → `src/payload.config.ts`

### Styling

- Tailwind CSS v4 with `@tailwindcss/typography` and `tw-animate-css`
- shadcn/ui components in `src/components/ui/` (configured via `components.json`, utils alias points to `@/utilities/ui`)
- Geist font (sans + mono)
- Dark mode via theme provider

### Database

PostgreSQL via `@payloadcms/db-postgres`. In dev, `push: true` auto-syncs schema. For production, create and run migrations explicitly.

## Payload CMS Rules

- **Always pass `req`** to nested Payload operations in hooks for transaction safety
- **Set `overrideAccess: false`** when passing `user` to Local API calls
- **Run `generate:types`** after any collection/global schema change
- **Run `generate:importmap`** after creating or modifying admin components
- Admin components are referenced by **file path strings** (not imports) in config
- Use `context` flags to prevent infinite hook loops
- Ensure roles exist when modifying collections/globals with access controls

## Testing

- Integration tests: `tests/int/**/*.int.spec.ts` (Vitest + jsdom)
- E2E tests: `tests/e2e/` (Playwright, Chromium only)
- Test helpers: `tests/helpers/`

## Integrations (Planned)

- **Luma** — Event registration (embed or link)
- **Mailchimp** — Newsletter subscription (direct API integration)
