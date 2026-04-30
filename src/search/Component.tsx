'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect, useTransition } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'

export const Search: React.FC = () => {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') || '')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const url = `/search${debouncedValue ? `?q=${debouncedValue}` : ''}`
    startTransition(() => {
      router.push(url)
    })
  }, [debouncedValue, router])

  return (
    <div className="relative max-w-2xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="search"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
            }}
            placeholder="Search articles..."
            className="pl-12 pr-12 py-6 text-lg shadow-none border-gray-200 bg-white text-black placeholder:text-gray-400"
          />
          {value && !isPending && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isPending && value && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          )}
        </div>
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
