'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

import type { Category, Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { getCategoryColor } from '@/utilities/getCategoryColor'
import { getReadingTime } from '@/utilities/getReadingTime'
import { formatDateTime } from '@/utilities/formatDateTime'

export type ArticleCardPost = {
  title: string
  slug: string
  categories?: (number | Category)[] | null
  meta?: { image?: number | MediaType | null; description?: string | null } | null
  heroImage?: number | MediaType | null
  populatedAuthors?: { id?: string | null; name?: string | null }[] | null
  publishedAt?: string | null
  content?: Post['content']
}

export const ArticleCard: React.FC<{
  post: ArticleCardPost
  variant?: 'default' | 'large'
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
    <motion.article
      ref={cardRef}
      className={cn(
        'group overflow-hidden bg-white hover:cursor-pointer',
        'transition-all duration-300 ease-out',
        'flex flex-col md:flex-row',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative overflow-hidden md:w-[45%] aspect-[16/10] md:aspect-auto md:min-h-[280px] shrink-0">
        {image && typeof image !== 'string' && typeof image !== 'number' ? (
          <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Media
              resource={image}
              fill
              imgClassName="object-cover"
              size="50vw"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-5 md:p-8 md:w-[55%] flex flex-col justify-center">
        {firstCategory && (
          <span
            className={cn(
              'inline-block self-start px-2.5 py-1 text-xs font-medium text-white mb-3',
              getCategoryColor(firstCategory.slug || ''),
            )}
          >
            {firstCategory.title}
          </span>
        )}
        {title && (
          <h3 className="font-bold text-xl md:text-2xl line-clamp-3 text-black">
            <Link className="hover:underline" href={href} ref={linkRef}>
              {title}
            </Link>
          </h3>
        )}
        {description && (
          <p className="text-gray-500 text-sm md:text-base line-clamp-2 mt-3">{description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-4 flex-wrap">
          {authorNames && <span>{authorNames}</span>}
          {publishedAt && (
            <>
              {authorNames && <span className="opacity-40">|</span>}
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </>
          )}
          <span className="opacity-40">|</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </motion.article>
  )
}
