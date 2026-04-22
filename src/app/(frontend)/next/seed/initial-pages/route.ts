import { createLocalReq, getPayload } from 'payload'
import { seedInitialPages } from '@/endpoints/seed/initial-pages'
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
    const result = await seedInitialPages({ payload, req: payloadReq })
    return Response.json({ success: true, ...result })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    payload.logger.error({ err, message: 'Error seeding initial pages' })
    return Response.json(
      {
        success: false,
        error: err.message,
        stack: err.stack?.split('\n').slice(0, 10).join('\n'),
      },
      { status: 500 },
    )
  }
}
