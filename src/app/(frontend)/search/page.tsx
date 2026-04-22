import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import { ArticleCard } from '@/components/ArticleCard'
import type { ArticleCardPost } from '@/components/ArticleCard'
import Link from 'next/link'
import { SearchX } from 'lucide-react'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24 bg-white text-black">
      <div className="container mb-16">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] text-center mb-8 lg:mb-12"
        >
          Search
        </h1>
        <Search />
      </div>

      <div className="container">
        {query && posts.totalDocs > 0 && (
          <p className="text-gray-500 mb-8">
            {posts.totalDocs} result{posts.totalDocs !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {posts.totalDocs > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.docs.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return <ArticleCard key={index} post={result as unknown as ArticleCardPost} />
              }
              return null
            })}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="w-16 h-16 text-gray-300 mb-6" />
            <h2 className="text-xl font-bold mb-2 text-black">No articles found</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Try a different search term or browse all articles
            </p>
            <Link
              href="/posts"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Articles
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Search — Beyond AI',
  }
}
