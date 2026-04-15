'use client'

import React, { useState } from 'react'
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
        <p className="text-lg font-medium">Message sent!</p>
        <p className="text-muted-foreground mt-1">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Textarea id="contact-message" name="message" placeholder="Your message" rows={5} required />
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
      {status === 'error' && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
    </form>
  )
}
