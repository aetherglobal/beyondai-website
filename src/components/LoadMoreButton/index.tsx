'use client'

import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleCard } from '@/components/ArticleCard'
import type { ArticleCardPost } from '@/components/ArticleCard'

export const LoadMoreButton: React.FC<{
  initialPosts: ArticleCardPost[]
  totalDocs: number
  limit: number
  initialPage: number
  category?: string
}> = ({ initialPosts, totalDocs, limit, initialPage, category }) => {
  const [posts, setPosts] = useState<ArticleCardPost[]>(initialPosts)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length < totalDocs)

  const loadMore = useCallback(async () => {
    setLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
        depth: '1',
        'where[_status][equals]': 'published',
      })

      if (category) {
        params.set('where[categories.slug][equals]', category)
      }

      const res = await fetch(`/api/posts?${params.toString()}`)
      const data = await res.json()

      if (data.docs && data.docs.length > 0) {
        setPosts((prev) => [...prev, ...data.docs])
        setPage(nextPage)
        setHasMore(data.hasNextPage)
      } else {
        setHasMore(false)
      }
    } catch {} finally {
      setLoading(false)
    }
  }, [page, limit, category])

  return (
    <div>
      <div className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <ArticleCard key={post.slug || index} post={post} />
        ))}
      </div>

      <AnimatePresence>
        {hasMore && (
          <motion.div
            className="flex flex-col items-center mt-12 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm text-gray-400">
              Showing {posts.length} of {totalDocs} articles
            </p>
            <Button
              onClick={loadMore}
              disabled={loading}
              variant="outline"
              size="lg"
              className="min-w-[200px] border-gray-300 text-black hover:bg-gray-50 shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Articles'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-12">
          You&apos;ve reached the end — {posts.length} articles total
        </p>
      )}
    </div>
  )
}
