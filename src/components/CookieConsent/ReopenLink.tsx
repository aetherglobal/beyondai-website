'use client'

import React from 'react'

import { reopenCookieConsent } from './index'

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={reopenCookieConsent} className={className}>
      Cookie preferences
    </button>
  )
}
