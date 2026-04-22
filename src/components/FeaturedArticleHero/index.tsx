'use client'

import React from 'react'
import Link from 'next/link'
import useClickableCard from '@/utilities/useClickableCard'
import { Media } from '@/components/Media'
import { getCategoryColor } from '@/utilities/getCategoryColor'
import { getReadingTime } from '@/utilities/getReadingTime'
import { formatDateTime } from '@/utilities/formatDateTime'
import { cn } from '@/utilities/ui'

import type { ArticleCardPost } from '@/components/ArticleCard'

export const FeaturedArticleHero: React.FC<{
  post: ArticleCardPost
  className?: string
}> = ({ post, className }) => {
  const { card, link } = useClickableCard<HTMLElement>({})
  const { slug, categories, heroImage, meta, title, populatedAuthors, publishedAt, content } = post
  const image = heroImage || meta?.image
  const href = `/posts/${slug}`
  const readingTime = getReadingTime(content as Record<string, unknown> | null)

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const firstCategory = hasCategories
    ? (categories.find((c) => typeof c === 'object') as { title: string; slug?: string } | undefined)
    : undefined

  const authorNames = populatedAuthors
    ?.map((a) => a.name)
    .filter(Boolean)
    .join(', ')

  return (
    <article
      ref={card.ref}
      className={cn(
        'relative overflow-hidden min-h-[40vh] md:min-h-[50vh] flex items-end',
        'hover:cursor-pointer transition-all duration-300 hover:-translate-y-1 group',
        className,
      )}
    >
      {image && typeof image !== 'string' && typeof image !== 'number' && (
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          <Media resource={image} fill imgClassName="object-cover" priority />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 p-6 md:p-10 w-full text-white">
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

        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4"
        >
          <Link href={href} ref={link.ref} className="hover:underline">
            {title}
          </Link>
        </h2>

        {meta?.description && (
          <p className="text-white/80 text-base md:text-lg line-clamp-2 max-w-2xl mb-4">
            {meta.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm text-white/70 flex-wrap">
          {authorNames && <span>{authorNames}</span>}
          {publishedAt && (
            <>
              {authorNames && <span className="opacity-50">|</span>}
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </>
          )}
          <span className="opacity-50">|</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </article>
  )
}
