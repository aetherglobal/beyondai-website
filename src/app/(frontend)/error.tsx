'use client'

import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('Route error:', error.digest ?? error.message)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary-deep">Error</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        Something went wrong on our end
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        This page failed to load. It is not something you did — trying again often works.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
    </div>
  )
}
