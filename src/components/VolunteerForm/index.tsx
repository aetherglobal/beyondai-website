'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormError, FormSuccess, HoneypotField, PrivacyNotice } from '@/components/FormStatus'
import { trackEvent } from '@/utilities/analytics'
import { useFormSubmit } from '@/utilities/useFormSubmit'

const AREAS_OF_INTEREST = [
  { label: 'Event Support', value: 'event-support' },
  { label: 'Research and Writing', value: 'research-writing' },
  { label: 'Media and Communications', value: 'media-communications' },
  { label: 'Community Outreach', value: 'community-outreach' },
  { label: 'Logistics', value: 'logistics' },
]

export const VolunteerForm: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const toggleArea = (value: string) => {
    setSelectedAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const { status, errorMessage, onSubmit } = useFormSubmit(
    '/api/volunteer',
    (formData) => ({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      country: formData.get('country'),
      areasOfInterest: selectedAreas,
      message: formData.get('message'),
      website: formData.get('website'),
    }),
    () => trackEvent('volunteer_signup'),
  )

  if (status === 'success') {
    return (
      <FormSuccess className={className}>
        <p className="text-lg font-medium">Thank you for volunteering!</p>
        <p className="text-muted-foreground mt-1">
          We&apos;ll be in touch with opportunities that match your interests.
        </p>
      </FormSuccess>
    )
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vol-name">Name *</Label>
          <Input id="vol-name" name="name" placeholder="Your name" autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="vol-email">Email *</Label>
          <Input
            id="vol-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="vol-phone">Phone</Label>
          <Input
            id="vol-phone"
            name="phone"
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="vol-city">City</Label>
          <Input id="vol-city" name="city" placeholder="City" autoComplete="address-level2" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="vol-country">Country</Label>
          <Input
            id="vol-country"
            name="country"
            placeholder="Country"
            autoComplete="country-name"
          />
        </div>
        {}
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium leading-none">Areas of Interest</legend>
          <div className="flex flex-wrap gap-2 mt-2">
            {AREAS_OF_INTEREST.map((area) => (
              <button
                key={area.value}
                type="button"
                aria-pressed={selectedAreas.includes(area.value)}
                onClick={() => toggleArea(area.value)}
                className={`min-h-[44px] px-3 py-1.5 text-sm rounded-none border transition-colors ${
                  selectedAreas.includes(area.value)
                    ? 'bg-primary text-primary-foreground border-primary-deep'
                    : 'border-border text-foreground hover:bg-accent'
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="md:col-span-2">
          <Label htmlFor="vol-message">Short Message</Label>
          <Textarea
            id="vol-message"
            name="message"
            placeholder="Tell us a bit about yourself"
            rows={4}
          />
        </div>
      </div>
      <HoneypotField />
      <Button type="submit" className="mt-4" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Sign Up to Volunteer'}
      </Button>
      <PrivacyNotice
        className="mt-3"
        purpose="We'll only use these details to contact you about volunteering."
      />
      {status === 'error' && <FormError className="mt-2" message={errorMessage} />}
    </form>
  )
}
