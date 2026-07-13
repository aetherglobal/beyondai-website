'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Category } from '@/payload-types'
import type { ArticleCardPost } from '@/components/ArticleCard'

import { Media } from '@/components/Media'
import { getCategoryColor } from '@/utilities/getCategoryColor'
import { getReadingTime } from '@/utilities/getReadingTime'
import { formatDateTime } from '@/utilities/formatDateTime'

export const InsightCard: React.FC<{
  post: ArticleCardPost
  className?: string
}> = ({ post, className }) => {
  const { cardRef, linkRef } = useClickableCard<HTMLElement>({})
  const { slug, categories, meta, heroImage, title, populatedAuthors, publishedAt, content } = post
  const { description, image: metaImage } = meta || {}
  const image = heroImage || metaImage
  const href = `/posts/${slug}`
  const readingTime = getReadingTime(content as Record<string, unknown> | null)

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const firstCategory = hasCategories
    ? (categories.find((c) => typeof c === 'object') as Category | undefined)
    : undefined

  const authorNames = populatedAuthors
    ?.map((a) => a.name)
    .filter(Boolean)
    .join(', ')

  return (
    <article
      ref={cardRef}
      className={cn('group flex flex-col hover:cursor-pointer', className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image && typeof image !== 'string' && typeof image !== 'number' ? (
          <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Media
              resource={image}
              fill
              imgClassName="object-cover"
              size="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-foreground/5 text-sm text-primary-foreground/40">
            No image
          </div>
        )}
        {firstCategory && (
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 text-xs font-medium text-white',
              getCategoryColor(firstCategory.slug || ''),
            )}
          >
            {firstCategory.title}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          {authorNames && (
            <span className="text-sm font-semibold text-primary-foreground">{authorNames}</span>
          )}
          {publishedAt && (
            <time dateTime={publishedAt} className="shrink-0 text-sm text-primary-foreground/70">
              {formatDateTime(publishedAt)}
            </time>
          )}
        </div>

        {title && (
          <h3 className="text-lg font-bold leading-snug text-primary-foreground line-clamp-2 md:text-xl">
            <Link className="hover:underline" href={href} ref={linkRef}>
              {title}
            </Link>
          </h3>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-primary-foreground/75 line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground transition-all group-hover:gap-2.5"
          >
            Read More
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <span className="shrink-0 text-xs text-primary-foreground/70">{readingTime} min read</span>
        </div>
      </div>
    </article>
  )
}
