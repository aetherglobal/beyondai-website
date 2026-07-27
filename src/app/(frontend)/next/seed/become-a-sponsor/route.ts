import { createLocalReq, getPayload } from 'payload'
import { seedBecomeSponsorPage } from '@/endpoints/seed/initial-pages'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 60

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const payloadReq = await createLocalReq({ user }, payload)
    const result = await seedBecomeSponsorPage({ payload, req: payloadReq })
    return Response.json({ success: true, ...result })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    // Logged server-side only — the stack used to be returned in the response body.
    payload.logger.error({ err, message: 'Error seeding become-a-sponsor page' })
    return Response.json(
      { success: false, error: 'Error seeding become-a-sponsor page.' },
      { status: 500 },
    )
  }
}
