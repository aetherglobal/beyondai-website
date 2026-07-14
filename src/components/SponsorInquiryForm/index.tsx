'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trackEvent } from '@/utilities/analytics'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PARTNERSHIP_OPTIONS = [
  { label: 'Sponsorship', value: 'sponsorship' },
  { label: 'Collaboration', value: 'collaboration' },
  { label: 'Media Partnership', value: 'media-partnership' },
  { label: 'In-Kind Support', value: 'in-kind-support' },
  { label: 'Other', value: 'other' },
]

const labelCls = 'text-xs font-mono uppercase tracking-wider text-muted-foreground'
const fieldCls = 'mt-1.5 h-11'

export const SponsorInquiryForm: React.FC<{ className?: string }> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [partnershipInterest, setPartnershipInterest] = useState('')
  const reduceMotion = useReducedMotion()

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
      trackEvent('sponsor_inquiry', { partnership_interest: partnershipInterest || undefined })
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.3 }

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={transition}
          className={className}
        >
          <CheckCircle className="h-8 w-8 text-primary-deep" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-foreground">Inquiry received</p>
          <p className="text-muted-foreground mt-1 leading-relaxed">
            Thank you for your interest in partnering with Beyond AI. Our team will respond within 2
            business days.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className={className}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={transition}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sponsor-name" className={labelCls}>
                Name *
              </Label>
              <Input id="sponsor-name" name="name" placeholder="Your name" required className={fieldCls} />
            </div>
            <div>
              <Label htmlFor="sponsor-email" className={labelCls}>
                Email *
              </Label>
              <Input
                id="sponsor-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className={fieldCls}
              />
            </div>
            <div>
              <Label htmlFor="sponsor-org" className={labelCls}>
                Organization *
              </Label>
              <Input
                id="sponsor-org"
                name="organization"
                placeholder="Organization name"
                required
                className={fieldCls}
              />
            </div>
            <div>
              <Label htmlFor="sponsor-title" className={labelCls}>
                Job Title
              </Label>
              <Input id="sponsor-title" name="jobTitle" placeholder="Your role" className={fieldCls} />
            </div>
            <div className="md:col-span-2">
              <Label className={labelCls}>Partnership Interest</Label>
              <Select value={partnershipInterest} onValueChange={setPartnershipInterest}>
                <SelectTrigger className="mt-1.5 h-11">
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
              <Label htmlFor="sponsor-message" className={labelCls}>
                Message *
              </Label>
              <Textarea
                id="sponsor-message"
                name="message"
                placeholder="Tell us about your organization and how you'd like to partner"
                rows={5}
                required
                className="mt-1.5"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full sm:w-auto uppercase tracking-wider font-semibold"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Submit Partnership Inquiry'}
          </Button>
          {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
