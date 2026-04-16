import type { Metadata } from 'next/types'

import { CategoryFilter } from '@/components/CategoryFilter'
import { FeaturedArticleHero } from '@/components/FeaturedArticleHero'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { NewsletterForm } from '@/components/NewsletterForm'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
  })

  const featuredResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      ...(category ? { 'categories.slug': { equals: category } } : { featured: { equals: true } }),
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      populatedAuthors: true,
      publishedAt: true,
      content: true,
      featured: true,
    },
  })

  let featuredPost = featuredResult.docs[0] || null

  if (!featuredPost && !category) {
    const latestResult = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        heroImage: true,
        populatedAuthors: true,
        publishedAt: true,
        content: true,
        featured: true,
      },
    })
    featuredPost = latestResult.docs[0] || null
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    ...(category
      ? {
          where: {
            'categories.slug': { equals: category },
            ...(featuredPost ? { id: { not_equals: featuredPost.id } } : {}),
          },
        }
      : featuredPost
        ? {
            where: {
              id: { not_equals: featuredPost.id },
            },
          }
        : {}),
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      populatedAuthors: true,
      publishedAt: true,
      content: true,
    },
  })

  return (
    <div className="pb-24 bg-white text-black">
      <div className="container pt-24 mb-8">
        <h1 className="font-bold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Articles
        </h1>
        <p className="text-gray-500 text-lg mt-2 max-w-2xl">
          Insights on AI governance, policy, and digital transformation in Africa.
        </p>
        <div className="mt-6 h-1 w-24 bg-secondary" />
      </div>

      <CategoryFilter categories={categories.docs} />

      {featuredPost && (
        <div className="container mt-8">
          <FeaturedArticleHero post={featuredPost} />
        </div>
      )}

      <div className="container mt-12">
        <LoadMoreButton
          initialPosts={posts.docs}
          totalDocs={posts.totalDocs}
          limit={12}
          initialPage={1}
          category={category}
        />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Articles — Beyond AI',
  }
}
