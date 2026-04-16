'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArticleCard } from '@/components/ArticleCard'
import type { ArticleCardPost } from '@/components/ArticleCard'

export const BentoGrid: React.FC<{
  posts: ArticleCardPost[]
  staggerDelay?: number
}> = ({ posts, staggerDelay = 0.05 }) => {
  if (posts.length === 0) return null

  const rows: { posts: ArticleCardPost[]; pattern: 'A' | 'B' | 'C' }[] = []
  let idx = 0
  let patternIdx = 0
  const patterns: ('A' | 'B' | 'C')[] = ['A', 'B', 'C']

  while (idx < posts.length) {
    const pattern = patterns[patternIdx % 3]!
    const remaining = posts.length - idx

    if (pattern === 'A' && remaining >= 3) {
      rows.push({ posts: posts.slice(idx, idx + 3), pattern: 'A' })
      idx += 3
    } else if (pattern === 'B' && remaining >= 2) {
      rows.push({ posts: posts.slice(idx, idx + 2), pattern: 'B' })
      idx += 2
    } else if (pattern === 'C' && remaining >= 3) {
      rows.push({ posts: posts.slice(idx, idx + 3), pattern: 'C' })
      idx += 3
    } else {
      rows.push({ posts: posts.slice(idx), pattern: 'C' })
      idx = posts.length
    }

    patternIdx++
  }

  let cardIndex = 0

  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, rowIdx) => {
        if (row.pattern === 'A') {
          const [large, small1, small2] = row.posts
          return (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <motion.div
                className="lg:col-span-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (cardIndex++) * staggerDelay }}
              >
                <ArticleCard post={large!} variant="large" className="h-full" />
              </motion.div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (cardIndex++) * staggerDelay }}
                >
                  <ArticleCard post={small1!} className="h-full" />
                </motion.div>
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (cardIndex++) * staggerDelay }}
                >
                  <ArticleCard post={small2!} className="h-full" />
                </motion.div>
              </div>
            </div>
          )
        }

        if (row.pattern === 'B') {
          return (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {row.posts.map((post) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (cardIndex++) * staggerDelay }}
                >
                  <ArticleCard post={post} className="h-full" />
                </motion.div>
              ))}
            </div>
          )
        }

        return (
          <div
            key={rowIdx}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {row.posts.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (cardIndex++) * staggerDelay }}
              >
                <ArticleCard post={post} className="h-full" />
              </motion.div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
