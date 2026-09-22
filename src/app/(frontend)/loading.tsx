import React from 'react'

export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div className="min-h-[50vh] bg-card" />
      <div className="container py-16">
        <div className="h-4 w-32 bg-card" />
        <div className="mt-6 h-10 w-3/4 max-w-2xl bg-card" />
        <div className="mt-4 h-4 w-full max-w-xl bg-card" />
        <div className="mt-2 h-4 w-5/6 max-w-xl bg-card" />
      </div>
    </div>
  )
}
