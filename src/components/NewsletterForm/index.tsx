'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const NewsletterForm: React.FC<{ className?: string; compact?: boolean }> = ({
  className,
  compact = false,
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone'),
          city: formData.get('city'),
          country: formData.get('country'),
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
        <p className="text-lg font-medium">Thank you for subscribing!</p>
        <p className="text-muted-foreground mt-1">
          You&apos;ll receive the AI Pulse newsletter in your inbox.
        </p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="flex gap-2">
          <Input
            name="email"
            type="email"
            className="h-10"
            placeholder="Your email address"
            required
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nl-firstName">First Name</Label>
          <Input id="nl-firstName" name="firstName" placeholder="First name" />
        </div>
        <div>
          <Label htmlFor="nl-lastName">Last Name</Label>
          <Input id="nl-lastName" name="lastName" placeholder="Last name" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nl-email">Email *</Label>
          <Input id="nl-email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <Label htmlFor="nl-phone">Phone</Label>
          <Input id="nl-phone" name="phone" type="tel" placeholder="Phone number" />
        </div>
        <div>
          <Label htmlFor="nl-city">City</Label>
          <Input id="nl-city" name="city" placeholder="City" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nl-country">Country</Label>
          <Input id="nl-country" name="country" placeholder="Country" />
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe to AI Pulse'}
      </Button>
      {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
    </form>
  )
}
