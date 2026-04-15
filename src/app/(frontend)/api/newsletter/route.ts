import { NextResponse } from 'next/server'
import mailchimp from '@mailchimp/mailchimp_marketing'

const apiKey = process.env.MAILCHIMP_API_KEY
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

if (apiKey && serverPrefix) {
  mailchimp.setConfig({
    apiKey,
    server: serverPrefix,
  })
}

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, phone, city, country } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!apiKey || !serverPrefix || !audienceId) {
      console.error('Mailchimp environment variables not configured')
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 503 },
      )
    }

    await mailchimp.lists.addListMember(audienceId, {
      email_address: email,
      status: 'subscribed' as const,
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
        PHONE: phone || '',
        CITY: city || '',
        COUNTRY: country || '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const mailchimpError = error as { response?: { body?: { title?: string; detail?: string } } }
    const errorBody = mailchimpError?.response?.body

    if (errorBody?.title === 'Member Exists') {
      return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 })
    }

    console.error('Mailchimp error:', errorBody || error)
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}
