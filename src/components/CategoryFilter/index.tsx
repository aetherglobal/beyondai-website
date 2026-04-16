'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/utilities/ui'

export const CategoryFilter: React.FC<{
  categories: { title: string; slug: string }[]
}> = ({ categories }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || ''

  const handleClick = (slug: string) => {
    if (slug === '') {
      router.push('/posts', { scroll: false })
    } else {
      router.push(`/posts?category=${slug}`, { scroll: false })
    }
  }

  const allCategories = [{ title: 'All', slug: '' }, ...categories]

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {allCategories.map((category) => {
            const isActive = category.slug === activeCategory

            return (
              <button
                key={category.slug}
                onClick={() => handleClick(category.slug)}
                className={cn(
                  'relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-secondary-foreground'
                    : 'text-gray-500 hover:text-black border border-gray-200',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-secondary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{category.title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
