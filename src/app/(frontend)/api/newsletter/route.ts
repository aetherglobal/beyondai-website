import { NextResponse } from 'next/server'
import mailchimp from '@mailchimp/mailchimp_marketing'

import { guardSubmission, trim, withTimeout } from '@/utilities/submissionGuard'

const apiKey = process.env.MAILCHIMP_API_KEY
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

if (apiKey && serverPrefix) {
  mailchimp.setConfig({
    apiKey,
    server: serverPrefix,
  })
}

type NewsletterPayload = {
  email?: unknown
  firstName?: unknown
  lastName?: unknown
  phone?: unknown
  city?: unknown
  country?: unknown
}

export async function POST(request: Request) {
  const guarded = await guardSubmission<NewsletterPayload>(request)
  if (!guarded.ok) return guarded.response

  const data = guarded.data
  const email = trim(data.email, 254)

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  if (!apiKey || !serverPrefix || !audienceId) {
    console.error('Mailchimp environment variables not configured')
    return NextResponse.json({ error: 'Newsletter service is not configured' }, { status: 503 })
  }

  try {
    await withTimeout(
      mailchimp.lists.addListMember(audienceId, {
        email_address: email,
        status: 'pending' as const,
        merge_fields: {
          FNAME: trim(data.firstName, 100) || '',
          LNAME: trim(data.lastName, 100) || '',
          PHONE: trim(data.phone, 40) || '',
          CITY: trim(data.city, 100) || '',
          COUNTRY: trim(data.country, 100) || '',
        },
        tags: ['AI Pulse'],
      }),
      8000,
      'Mailchimp addListMember',
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const mailchimpError = error as { response?: { body?: { title?: string; detail?: string } } }
    const errorBody = mailchimpError?.response?.body

    if (errorBody?.title === 'Member Exists') {
      return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 })
    }

    console.error('Mailchimp error:', errorBody?.title || (error as Error)?.message || 'unknown')
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}
