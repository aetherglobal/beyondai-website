'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PARTNERSHIP_OPTIONS = [
  { label: 'Sponsorship', value: 'sponsorship' },
  { label: 'Knowledge Partnership', value: 'knowledge-partnership' },
  { label: 'Community Partnership', value: 'community-partnership' },
  { label: 'In-Kind Support', value: 'in-kind-support' },
  { label: 'Other', value: 'other' },
]

export const SponsorInquiryForm: React.FC<{ className?: string }> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [partnershipInterest, setPartnershipInterest] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: `Sponsor Inquiry – ${PARTNERSHIP_OPTIONS.find((o) => o.value === partnershipInterest)?.label || 'General'}`,
          message: formData.get('message'),
          source: 'sponsor-inquiry',
          organization: formData.get('organization'),
          jobTitle: formData.get('jobTitle'),
          partnershipInterest: partnershipInterest || undefined,
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
        <p className="text-lg font-medium text-white">Inquiry received!</p>
        <p className="text-muted-foreground mt-1">
          Thank you for your interest in partnering with Beyond AI. Our team will respond within 2
          business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sponsor-name">Name *</Label>
          <Input id="sponsor-name" name="name" placeholder="Your name" required />
        </div>
        <div>
          <Label htmlFor="sponsor-email">Email *</Label>
          <Input
            id="sponsor-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="sponsor-org">Organization *</Label>
          <Input id="sponsor-org" name="organization" placeholder="Organization name" required />
        </div>
        <div>
          <Label htmlFor="sponsor-title">Job Title</Label>
          <Input id="sponsor-title" name="jobTitle" placeholder="Your role" />
        </div>
        <div className="md:col-span-2">
          <Label>Partnership Interest</Label>
          <Select value={partnershipInterest} onValueChange={setPartnershipInterest}>
            <SelectTrigger className="mt-0.5">
              <SelectValue placeholder="Select partnership type" />
            </SelectTrigger>
            <SelectContent>
              {PARTNERSHIP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="sponsor-message">Message *</Label>
          <Textarea
            id="sponsor-message"
            name="message"
            placeholder="Tell us about your organization and how you'd like to partner"
            rows={5}
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        className="mt-6 uppercase tracking-wider font-semibold"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Submit Partnership Inquiry'}
      </Button>
      {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
    </form>
  )
}
