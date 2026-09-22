import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { guardSubmission, trim } from '@/utilities/submissionGuard'
import { notifySubmission } from '@/utilities/notifySubmission'

type VolunteerPayload = {
  name?: unknown
  email?: unknown
  phone?: unknown
  city?: unknown
  country?: unknown
  areasOfInterest?: unknown
  message?: unknown
}

const AREAS = [
  'event-support',
  'research-writing',
  'media-communications',
  'community-outreach',
  'logistics',
] as const

type Area = (typeof AREAS)[number]

export async function POST(request: Request) {
  const guarded = await guardSubmission<VolunteerPayload>(request)
  if (!guarded.ok) return guarded.response

  const data = guarded.data

  const name = trim(data.name, 120)
  const email = trim(data.email, 254)

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const areasOfInterest = Array.isArray(data.areasOfInterest)
    ? (data.areasOfInterest.filter((a): a is Area => AREAS.includes(a as Area)).slice(0, AREAS.length))
    : undefined

  try {
    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'volunteers',
      data: {
        name,
        email,
        phone: trim(data.phone, 40),
        city: trim(data.city, 100),
        country: trim(data.country, 100),
        areasOfInterest,
        message: trim(data.message, 5000),
      },
    })

    await notifySubmission(payload, {
      subject: `New volunteer application from ${name}`,
      lines: [
        `Name: ${name}`,
        `Email: ${email}`,
        data.phone ? `Phone: ${trim(data.phone, 40)}` : null,
        `Location: ${[trim(data.city, 100), trim(data.country, 100)].filter(Boolean).join(', ') || '—'}`,
        areasOfInterest?.length ? `Interested in: ${areasOfInterest.join(', ')}` : null,
        '',
        trim(data.message, 5000) || '(no message)',
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Volunteer submission error:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
