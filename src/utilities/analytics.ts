import { sendGAEvent } from '@next/third-parties/google'

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_GA_ID) return
  sendGAEvent('event', name, params ?? {})
}
