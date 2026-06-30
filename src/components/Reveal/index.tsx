import React from 'react'

/**
 * Lightweight entrance animation using CSS (tw-animate-css) rather than a JS
 * IntersectionObserver. The resting state is fully visible, so content is never
 * stuck hidden if JS is slow/absent, and `motion-safe:` disables it under
 * `prefers-reduced-motion`. Mount-triggered: above-the-fold elements animate in;
 * below-the-fold ones have settled by the time they're scrolled into view.
 *
 * Server-safe (no hooks) so it can wrap content inside server components.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  /** Stagger delay in milliseconds. */
  delay?: number
  className?: string
}) {
  return (
    <div
      className={`motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700 motion-safe:ease-out motion-safe:[animation-fill-mode:both] ${
        className ?? ''
      }`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
