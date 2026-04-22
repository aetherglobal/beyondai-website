import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { getCategoryColor } from '@/utilities/getCategoryColor'
import { getReadingTime } from '@/utilities/getReadingTime'
import { cn } from '@/utilities/ui'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title, content } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const readingTime = getReadingTime(content as Record<string, unknown> | null)

  const firstCategory =
    categories && Array.isArray(categories)
      ? (categories.find((c) => typeof c === 'object') as
          | { title: string; slug?: string }
          | undefined)
      : undefined

  return (
    <div className="relative -mt-[10.4rem] flex items-end min-h-[80vh] overflow-hidden">
      <div className="container z-10 relative text-white pb-10 md:pb-14">
        <div className="max-w-3xl">
          {firstCategory && (
            <span
              className={cn(
                'inline-block px-3 py-1 text-xs font-medium text-white mb-4',
                getCategoryColor(firstCategory.slug || ''),
              )}
            >
              {firstCategory.title}
            </span>
          )}

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-6"
          >
            {title}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-white/80">
            {hasAuthors && <span>{formatAuthors(populatedAuthors)}</span>}
            {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
      </div>
    </div>
  )
}
