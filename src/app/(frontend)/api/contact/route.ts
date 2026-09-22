import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { guardSubmission, trim } from '@/utilities/submissionGuard'
import { notifySubmission } from '@/utilities/notifySubmission'

type ContactPayload = {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  source?: unknown
  organization?: unknown
  jobTitle?: unknown
  partnershipInterest?: unknown
}

const SOURCES = ['contact-form', 'sponsor-inquiry'] as const
const INTERESTS = [
  'sponsorship',
  'collaboration',
  'media-partnership',
  'in-kind-support',
  'other',
] as const

export async function POST(request: Request) {
  const guarded = await guardSubmission<ContactPayload>(request)
  if (!guarded.ok) return guarded.response

  const data = guarded.data

  const name = trim(data.name, 120)
  const email = trim(data.email, 254)
  const message = trim(data.message, 5000)

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
  }

  const rawSource = trim(data.source, 50)
  const source = SOURCES.includes(rawSource as (typeof SOURCES)[number])
    ? (rawSource as (typeof SOURCES)[number])
    : 'contact-form'

  const rawInterest = trim(data.partnershipInterest, 50)
  const partnershipInterest = INTERESTS.includes(rawInterest as (typeof INTERESTS)[number])
    ? (rawInterest as (typeof INTERESTS)[number])
    : undefined

  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        subject: trim(data.subject, 200),
        message,
        source,
        organization: trim(data.organization, 200),
        jobTitle: trim(data.jobTitle, 150),
        partnershipInterest,
      },
    })

    await notifySubmission(payload, {
      subject:
        source === 'sponsor-inquiry'
          ? `New sponsor enquiry from ${name}`
          : `New contact message from ${name}`,
      lines: [
        `Name: ${name}`,
        `Email: ${email}`,
        data.organization ? `Organisation: ${doc.organization}` : null,
        data.jobTitle ? `Job title: ${doc.jobTitle}` : null,
        partnershipInterest ? `Interest: ${partnershipInterest}` : null,
        '',
        message,
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
