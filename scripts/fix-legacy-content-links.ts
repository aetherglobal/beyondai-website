/**
 * Rewrite WordPress-era absolute self-links (`https://www.beyondai.africa/...`) inside CMS
 * content to relative paths, removing a redirect hop.
 *
 * Only self-links are touched. External citations are left alone, including ones that
 * answer 401/402/403 to bots — those are paywalls, not broken links.
 *
 *   DRY_RUN=1 NODE_ENV=production npx tsx scripts/fix-legacy-content-links.ts
 *   NODE_ENV=production npx tsx scripts/fix-legacy-content-links.ts
 */
import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'

const DRY_RUN = process.env.DRY_RUN === '1'

const TARGETS = ['posts', 'pages', 'events'] as const

const LEGACY_HOST = /^https?:\/\/(?:www\.)?beyondai\.africa(\/[^\s]*)?$/i

/** `https://www.beyondai.africa/foo/` -> `/foo`; the bare host -> `/`. */
const toRelative = (url: string): string | null => {
  const m = LEGACY_HOST.exec(url.trim())
  if (!m) return null

  const path = (m[1] || '/').replace(/\/+$/, '')

  return path === '' ? '/' : path
}

type Rewrite = { collection: string; slug: string; id: number | string; from: string; to: string }

/** Rewrites link-node URLs in place, anywhere in a nested Lexical tree. */
const rewriteLinks = (node: unknown, onRewrite: (from: string, to: string) => void): void => {
  if (Array.isArray(node)) {
    for (const child of node) rewriteLinks(child, onRewrite)
    return
  }

  if (!node || typeof node !== 'object') return

  const obj = node as Record<string, unknown>

  if (obj.type === 'link') {
    const fields = obj.fields as Record<string, unknown> | undefined
    const url = typeof fields?.url === 'string' ? fields.url : undefined

    if (url) {
      const next = toRelative(url)
      if (next && next !== url) {
        fields!.url = next
        onRewrite(url, next)
      }
    }
  }

  for (const value of Object.values(obj)) rewriteLinks(value, onRewrite)
}

const main = async () => {
  const payload = await getPayload({ config })
  const dbHost = process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : '<DATABASE_URL unset>'

  console.log(`\ntarget database : ${dbHost}`)
  console.log(`mode            : ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE WRITE'}\n`)

  const req = await createLocalReq({ context: { disableRevalidate: true } }, payload)
  const applied: Rewrite[] = []

  for (const collection of TARGETS) {
    const { docs } = await payload.find({
      collection,
      limit: 500,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      req,
    })

    for (const doc of docs) {
      const found: { from: string; to: string }[] = []
      // Clone so a dry run never mutates anything we might later persist by accident.
      const copy = JSON.parse(JSON.stringify(doc))
      rewriteLinks(copy, (from, to) => found.push({ from, to }))

      if (found.length === 0) continue

      for (const f of found) {
        applied.push({ collection, slug: String(doc.slug), id: doc.id, ...f })
      }

      console.log(`${collection}/${doc.slug} (id ${doc.id}) — ${found.length} link(s)`)
      for (const f of found) console.log(`    ${f.from}  ->  ${f.to}`)

      if (!DRY_RUN) {
        await payload.update({
          collection,
          id: doc.id,
          data: copy,
          req,
          overrideAccess: true,
        })
        console.log('    updated')
      }
    }
  }

  if (applied.length === 0) {
    console.log('No WordPress-era self-links found. Nothing to do.\n')
    return
  }

  console.log(
    `\n${DRY_RUN ? 'Would rewrite' : 'Rewrote'} ${applied.length} link(s) across ` +
      `${new Set(applied.map((a) => `${a.collection}/${a.slug}`)).size} document(s).`,
  )
  if (DRY_RUN) console.log('DRY RUN — nothing written. Re-run without DRY_RUN=1 to apply.')
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('failed:', e instanceof Error ? (e.stack ?? e.message) : e)
    process.exit(1)
  })
