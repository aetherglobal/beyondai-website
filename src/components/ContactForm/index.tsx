'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormError, FormSuccess, HoneypotField, PrivacyNotice } from '@/components/FormStatus'
import { trackEvent } from '@/utilities/analytics'
import { useFormSubmit } from '@/utilities/useFormSubmit'

export const ContactForm: React.FC<{ className?: string }> = ({ className }) => {
  const { status, errorMessage, onSubmit, reset } = useFormSubmit(
    '/api/contact',
    (formData) => ({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      source: 'contact-form',
      website: formData.get('website'),
    }),
    () => trackEvent('contact_submit', { source: 'contact-form' }),
  )

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <FormSuccess
            key="success"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 text-primary-deep mb-6" strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-2">
              Message Sent
            </h3>
            <p className="text-muted-foreground mb-8">
              Thank you for reaching out. We typically respond within 48 hours.
            </p>
            <button
              onClick={reset}
              className="text-sm text-primary-deep uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Send Another Message
            </button>
          </FormSuccess>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onSubmit={onSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" name="subject" placeholder="Subject" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  required
                />
              </div>
            </div>
            <HoneypotField />
            <Button
              type="submit"
              className="mt-6 w-full uppercase tracking-wider font-semibold"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
            <PrivacyNotice
              className="mt-3"
              purpose="We'll only use these details to reply to you."
            />
            {status === 'error' && <FormError className="mt-3" message={errorMessage} />}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
