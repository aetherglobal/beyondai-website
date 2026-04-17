'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const ContactForm: React.FC<{ className?: string }> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
          subject: formData.get('subject'),
          message: formData.get('message'),
          source: 'contact-form',
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

  const handleReset = () => {
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 text-primary mb-6" strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-2">
              Message Sent
            </h3>
            <p className="text-muted-foreground mb-8">
              Thank you for reaching out. We typically respond within 48 hours.
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-primary uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="contact-name">Name *</Label>
                <Input id="contact-name" name="name" placeholder="Your name" required />
              </div>
              <div>
                <Label htmlFor="contact-email">Email *</Label>
                <Input id="contact-email" name="email" type="email" placeholder="you@example.com" required />
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
            <Button
              type="submit"
              className="mt-6 w-full uppercase tracking-wider font-semibold"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
            {status === 'error' && (
              <p className="text-sm text-destructive mt-3">{errorMessage}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
