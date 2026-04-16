import { cn } from '@/utilities/ui'
import React from 'react'

import { ArticleCard } from '@/components/ArticleCard'
import type { ArticleCardPost } from '@/components/ArticleCard'

export type Props = {
  posts: ArticleCardPost[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <ArticleCard key={index} post={result} />
          }
          return null
        })}
      </div>
    </div>
  )
}
