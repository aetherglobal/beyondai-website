import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

export const CategoryFilter: React.FC<{
  categories: { title: string; slug: string }[]
  activeCategory?: string
}> = ({ categories, activeCategory = '' }) => (
  <div className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
    <div className="container">
      <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
        {[{ title: 'All', slug: '' }, ...categories].map((category) => {
          const isActive = category.slug === activeCategory

          return (
            <Link
              key={category.slug}
              href={category.slug ? `/posts?category=${category.slug}` : '/posts'}
              scroll={false}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'px-4 py-1.5 text-sm font-medium whitespace-nowrap border transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-gray-500 hover:text-black border-gray-200',
              )}
            >
              {category.title}
            </Link>
          )
        })}
      </div>
    </div>
  </div>
)
