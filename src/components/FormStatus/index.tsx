'use client'

import React from 'react'
import Link from 'next/link'

export const FormError: React.FC<{ message: string; className?: string }> = ({
  message,
  className,
}) => (
  <p role="alert" className={`text-sm text-destructive ${className ?? ''}`}>
    {message}
  </p>
)

export const FormSuccess: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div ref={ref} role="status" aria-live="polite" tabIndex={-1} className={className}>
      {children}
    </div>
  )
}

export const HoneypotField: React.FC = () => (
  <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
    <label htmlFor="website-hp">Leave this field empty</label>
    <input id="website-hp" name="website" type="text" tabIndex={-1} autoComplete="off" />
  </div>
)

export const PrivacyNotice: React.FC<{ purpose: string; className?: string }> = ({
  purpose,
  className,
}) => (
  <p className={`text-xs text-muted-foreground ${className ?? ''}`}>
    {purpose} See our{' '}
    <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
      Privacy Policy
    </Link>
    .
  </p>
)
