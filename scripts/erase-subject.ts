import mailchimp from '@mailchimp/mailchimp_marketing'
import crypto from 'crypto'
import type { Payload } from 'payload'

const COLLECTIONS = ['contact-submissions', 'volunteers'] as const

const isDryRun = process.env.CONFIRM !== '1'

async function eraseFromMailchimp(email: string): Promise<string> {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !serverPrefix || !audienceId) {
    return 'Mailchimp: skipped (not configured)'
  }

  mailchimp.setConfig({ apiKey, server: serverPrefix })

  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex')

  if (isDryRun) return `Mailchimp: would permanently delete ${email}`

  try {
    await mailchimp.lists.deleteListMemberPermanent(audienceId, hash)
    return `Mailchimp: permanently deleted ${email}`
  } catch (error) {
    const status = (error as { status?: number })?.status
    if (status === 404) return 'Mailchimp: no subscriber found'
    throw error
  }
}

export default async function eraseSubject({ payload }: { payload: Payload }) {
  const email = process.argv[process.argv.length - 1]

  if (!email || !email.includes('@')) {
    throw new Error('Usage: bun payload run scripts/erase-subject.ts <email>')
  }

  const report: string[] = []

  if (isDryRun) {
    report.push('DRY RUN — nothing will be deleted. Re-run with CONFIRM=1 to erase.\n')
  }

  for (const collection of COLLECTIONS) {
    const { docs } = await payload.find({
      collection,
      where: { email: { equals: email } },
      limit: 1000,
      pagination: false,
      depth: 0,
    })

    if (docs.length === 0) {
      report.push(`${collection}: no records`)
      continue
    }

    if (isDryRun) {
      report.push(`${collection}: would delete ${docs.length} record(s)`)
      continue
    }

    await payload.delete({ collection, where: { email: { equals: email } } })
    report.push(`${collection}: deleted ${docs.length} record(s)`)
  }

  report.push(await eraseFromMailchimp(email))

  payload.logger.info(`\nErasure report for ${email}\n${'-'.repeat(40)}\n${report.join('\n')}\n`)
}
