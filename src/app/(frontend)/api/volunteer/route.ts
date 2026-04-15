import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { name, email, phone, city, country, areasOfInterest, message } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'volunteers',
      data: {
        name,
        email,
        phone: phone || undefined,
        city: city || undefined,
        country: country || undefined,
        areasOfInterest: areasOfInterest || undefined,
        message: message || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Volunteer submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 },
    )
  }
}
