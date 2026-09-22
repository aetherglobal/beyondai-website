'use client'

import React, { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useFormSubmit(
  endpoint: string,
  buildBody: (form: FormData) => Record<string, unknown>,
  onSuccess?: () => void,
) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = buildBody(new FormData(event.currentTarget))

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('success')
      onSuccess?.()
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setErrorMessage('')
  }

  return { status, errorMessage, onSubmit, reset }
}
