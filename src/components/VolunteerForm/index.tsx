'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const AREAS_OF_INTEREST = [
  { label: 'Event Support', value: 'event-support' },
  { label: 'Research and Writing', value: 'research-writing' },
  { label: 'Media and Communications', value: 'media-communications' },
  { label: 'Community Outreach', value: 'community-outreach' },
  { label: 'Logistics', value: 'logistics' },
]

export const VolunteerForm: React.FC<{ className?: string }> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const toggleArea = (value: string) => {
    setSelectedAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          city: formData.get('city'),
          country: formData.get('country'),
          areasOfInterest: selectedAreas,
          message: formData.get('message'),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={className}>
        <p className="text-lg font-medium">Thank you for volunteering!</p>
        <p className="text-muted-foreground mt-1">
          We&apos;ll be in touch with opportunities that match your interests.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vol-name">Name *</Label>
          <Input id="vol-name" name="name" placeholder="Your name" required />
        </div>
        <div>
          <Label htmlFor="vol-email">Email *</Label>
          <Input id="vol-email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <Label htmlFor="vol-phone">Phone</Label>
          <Input id="vol-phone" name="phone" type="tel" placeholder="Phone number" />
        </div>
        <div>
          <Label htmlFor="vol-city">City</Label>
          <Input id="vol-city" name="city" placeholder="City" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="vol-country">Country</Label>
          <Input id="vol-country" name="country" placeholder="Country" />
        </div>
        <div className="md:col-span-2">
          <Label>Areas of Interest</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {AREAS_OF_INTEREST.map((area) => (
              <button
                key={area.value}
                type="button"
                onClick={() => toggleArea(area.value)}
                className={`px-3 py-1.5 text-sm rounded-none border transition-colors ${
                  selectedAreas.includes(area.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="vol-message">Short Message</Label>
          <Textarea id="vol-message" name="message" placeholder="Tell us a bit about yourself" rows={4} />
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Sign Up to Volunteer'}
      </Button>
      {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
    </form>
  )
}
