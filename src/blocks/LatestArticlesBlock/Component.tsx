import React from 'react'
import Link from 'next/link'

import type { LatestArticlesBlockType } from '@/payload-types'
import { ArticleCard } from '@/components/ArticleCard'
import { getLatestPosts } from '@/blocks/_data/cached-queries'

type Props = LatestArticlesBlockType & { disableInnerContainer?: boolean }

export const LatestArticlesBlockComponent: React.FC<Props> = async ({
  heading,
  ctaLabel,
  ctaHref,
  limit,
}) => {
  const posts = await getLatestPosts(limit ?? 3)
  if (posts.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          {heading && <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-gray-900">{heading}</h2>}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-primary hover:border-primary-deep hover:text-primary-foreground transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
