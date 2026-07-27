/**
 * Create (or update) the `/privacy` page the cookie consent banner links to.
 *
 * Seeds ONLY that page. Never run `seedInitialPages` against a live database — it upserts
 * all eight pages and would overwrite editor changes with the seed defaults.
 *
 *   DRY_RUN=1 NODE_ENV=production npx tsx scripts/seed-privacy-page.ts
 *   NODE_ENV=production npx tsx scripts/seed-privacy-page.ts
 */
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

  // Without this, the afterChange hook's `revalidatePath` throws outside a request context
  // and takes the write down with it. The following redeploy refreshes the cache.
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
