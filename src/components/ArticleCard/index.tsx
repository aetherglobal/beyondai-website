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
}> = ({ post, variant = 'default', className }) => {
  const { card, link } = useClickableCard<HTMLElement>({})
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

  const isLarge = variant === 'large'

  return (
    <motion.article
      ref={card.ref}
      className={cn(
        'group border border-gray-200 overflow-hidden bg-white hover:cursor-pointer',
        'transition-all duration-300 ease-out hover:-translate-y-0.5',
        isLarge && 'md:flex md:flex-row',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          isLarge ? 'md:w-1/2 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]',
        )}
      >
        {image && typeof image !== 'string' && typeof image !== 'number' ? (
          <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Media
              resource={image}
              fill
              imgClassName="object-cover"
              size={isLarge ? '50vw' : '33vw'}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {firstCategory && (
          <span
            className={cn(
              'absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium text-white',
              getCategoryColor(firstCategory.slug || ''),
            )}
          >
            {firstCategory.title}
          </span>
        )}
      </div>

      <div className={cn('p-5', isLarge && 'md:w-1/2 md:flex md:flex-col md:justify-center')}>
        {title && (
          <h3 className="font-bold text-lg line-clamp-2 text-black">
            <Link className="hover:underline" href={href} ref={link.ref}>
              {title}
            </Link>
          </h3>
        )}
        {description && (
          <p className="text-gray-500 text-sm line-clamp-2 mt-2">{description}</p>
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
