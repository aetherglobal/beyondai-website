/**
 * Create (or update) the `/privacy` page.
 *
 * The cookie consent banner links to `/privacy`; without this page the link 404s and the
 * GA4 consent flow has nowhere to point.
 *
 * Deliberately seeds ONLY the privacy page. Do not reach for `seedInitialPages` against a
 * live database — it upserts all eight pages and would overwrite editor changes with the
 * seed defaults.
 *
 * Usage (DRY_RUN first — `payload run` forwards positional args only, not flags, so the
 * mode is env-gated):
 *   DRY_RUN=1 NODE_ENV=production bun payload run scripts/seed-privacy-page.ts
 *   NODE_ENV=production bun payload run scripts/seed-privacy-page.ts
 *
 * NODE_ENV=production keeps the dev schema-push out of the way; this script makes no
 * schema changes.
 */
// `payload run` loads .env for you; this makes the script work under plain `tsx` too.
import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { buildPrivacyPage, seedPrivacyPage } from '@/endpoints/seed/initial-pages'

const DRY_RUN = process.env.DRY_RUN === '1'

const main = async () => {
  const payload = await getPayload({ config })
  const dbHost = process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : '<DATABASE_URL unset>'

  console.log(`\ntarget database : ${dbHost}`)
  console.log(`mode            : ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE WRITE'}\n`)

  const page = buildPrivacyPage()

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: page.slug } },
    limit: 1,
    overrideAccess: true,
  })
  const found = existing.docs[0]

  console.log(
    found
      ? `/${page.slug} already exists (id ${found.id}, _status=${found._status}) -> would UPDATE`
      : `/${page.slug} does not exist -> would CREATE`,
  )
  console.log(`  title  : ${page.title}`)
  console.log(`  status : ${page._status}`)
  console.log(`  blocks : ${(page.layout ?? []).map((b) => b?.blockType).join(', ') || '(none)'}`)

  if (DRY_RUN) {
    console.log('\nDRY RUN — nothing written. Re-run without DRY_RUN=1 to apply.\n')
    return
  }

  // `revalidatePage` (Pages afterChange) calls Next's `revalidatePath`, which throws
  // "static generation store missing" outside a request context and rolls the write back.
  // Skip it here; the cache is refreshed by the redeploy that follows.
  const req = await createLocalReq({ context: { disableRevalidate: true } }, payload)
  const result = await seedPrivacyPage({ payload, req })

  console.log(`\ndone: /${result.slug} (id ${result.id})`)

  const verify = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'privacy' } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = verify.docs[0]
  console.log(
    doc
      ? `verified in DB: id=${doc.id} slug=${doc.slug} _status=${doc._status} title="${doc.title}"`
      : 'VERIFY FAILED: page not found after write',
  )
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('failed:', e instanceof Error ? (e.stack ?? e.message) : e)
    process.exit(1)
  })
