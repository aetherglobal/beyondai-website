import React from 'react'
import Link from 'next/link'

import type { LatestArticlesBlockType } from '@/payload-types'
import { InsightCard } from '@/components/InsightCard'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'
import { getLatestPosts } from '@/blocks/_data/cached-queries'

type Props = LatestArticlesBlockType & { disableInnerContainer?: boolean }

export const LatestArticlesBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  ctaLabel,
  ctaHref,
  limit,
}) => {
  const posts = await getLatestPosts(limit ?? 3)
  if (posts.length === 0) return null

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow={eyebrow} heading={heading} onColored className="max-w-2xl" />
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex shrink-0 items-center self-start border border-primary-foreground/80 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary md:self-auto"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 70}>
              <InsightCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
