'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trackEvent } from '@/utilities/analytics'
import { useFormSubmit } from '@/utilities/useFormSubmit'
import { FormError, FormSuccess, HoneypotField, PrivacyNotice } from '@/components/FormStatus'
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
  const [partnershipInterest, setPartnershipInterest] = useState('')
  const reduceMotion = useReducedMotion()

  const { status, errorMessage, onSubmit } = useFormSubmit(
    '/api/contact',
    (formData) => ({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: `Sponsor Inquiry – ${PARTNERSHIP_OPTIONS.find((o) => o.value === partnershipInterest)?.label || 'General'}`,
      message: formData.get('message'),
      source: 'sponsor-inquiry',
      organization: formData.get('organization'),
      jobTitle: formData.get('jobTitle'),
      website: formData.get('website'),
      partnershipInterest: partnershipInterest || undefined,
    }),
    () => trackEvent('sponsor_inquiry', { partnership_interest: partnershipInterest || undefined }),
  )

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.3 }

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <FormSuccess key="success" className={className}>
          <CheckCircle className="h-8 w-8 text-primary-deep" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-foreground">Inquiry received</p>
          <p className="text-muted-foreground mt-1 leading-relaxed">
            Thank you for your interest in partnering with Beyond AI. Our team will respond within 2
            business days.
          </p>
        </FormSuccess>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
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
              <Input
                id="sponsor-name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
                className={fieldCls}
              />
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
                autoComplete="email"
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
                autoComplete="organization"
                required
                className={fieldCls}
              />
            </div>
            <div>
              <Label htmlFor="sponsor-title" className={labelCls}>
                Job Title
              </Label>
              <Input
                id="sponsor-title"
                name="jobTitle"
                placeholder="Your role"
                autoComplete="organization-title"
                className={fieldCls}
              />
            </div>
            <div className="md:col-span-2">
              <Label className={labelCls} htmlFor="sponsor-interest">
                Partnership Interest
              </Label>
              <Select value={partnershipInterest} onValueChange={setPartnershipInterest}>
                <SelectTrigger id="sponsor-interest" className="mt-1.5 h-11">
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
          <HoneypotField />
          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full sm:w-auto uppercase tracking-wider font-semibold"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Submit Partnership Inquiry'}
          </Button>
          <PrivacyNotice
            className="mt-3"
            purpose="We'll only use these details to respond to your enquiry."
          />
          {status === 'error' && <FormError className="mt-2" message={errorMessage} />}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
