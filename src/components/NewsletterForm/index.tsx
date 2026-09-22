'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormError, FormSuccess, HoneypotField, PrivacyNotice } from '@/components/FormStatus'
import { trackEvent } from '@/utilities/analytics'
import { useFormSubmit } from '@/utilities/useFormSubmit'

export const NewsletterForm: React.FC<{ className?: string; compact?: boolean }> = ({
  className,
  compact = false,
}) => {
  const { status, errorMessage, onSubmit } = useFormSubmit(
    '/api/newsletter',
    (formData) => ({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      country: formData.get('country'),
      website: formData.get('website'),
    }),
    () => trackEvent('newsletter_subscribe'),
  )

  if (status === 'success') {
    return (
      <FormSuccess className={className}>
        <p className="text-sm font-medium">Almost there — check your inbox.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ve sent you a confirmation link. Click it to finish subscribing to AI Pulse.
        </p>
      </FormSuccess>
    )
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} className={className}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nl-compact-firstName" className="sr-only">
            First name
          </Label>
          <Input
            id="nl-compact-firstName"
            name="firstName"
            className="h-10"
            placeholder="Your name"
            autoComplete="given-name"
          />
          <Label htmlFor="nl-compact-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="nl-compact-email"
            name="email"
            type="email"
            className="h-10"
            placeholder="Your email address"
            autoComplete="email"
            required
          />
          <HoneypotField />
          <Button type="submit" className="w-fit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        <PrivacyNotice
          className="mt-2"
          purpose="We'll email you AI Pulse and nothing else. Unsubscribe any time."
        />
        {status === 'error' && <FormError className="mt-2" message={errorMessage} />}
      </form>
    )
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nl-firstName">First Name</Label>
          <Input
            id="nl-firstName"
            name="firstName"
            placeholder="First name"
            autoComplete="given-name"
          />
        </div>
        <div>
          <Label htmlFor="nl-lastName">Last Name</Label>
          <Input
            id="nl-lastName"
            name="lastName"
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nl-email">Email *</Label>
          <Input
            id="nl-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="nl-city">City</Label>
          <Input id="nl-city" name="city" placeholder="City" autoComplete="address-level2" />
        </div>
        <div>
          <Label htmlFor="nl-country">Country</Label>
          <Input id="nl-country" name="country" placeholder="Country" autoComplete="country-name" />
        </div>
      </div>
      <HoneypotField />
      <Button type="submit" className="mt-4" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe to AI Pulse'}
      </Button>
      <PrivacyNotice
        className="mt-3"
        purpose="We'll email you AI Pulse and nothing else, and you'll get a confirmation link first. Unsubscribe any time."
      />
      {status === 'error' && <FormError className="mt-2" message={errorMessage} />}
    </form>
  )
}
