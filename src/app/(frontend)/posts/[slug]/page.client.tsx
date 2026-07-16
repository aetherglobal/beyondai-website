'use client'

import React from 'react'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { ShareBar } from '@/components/ShareBar'

export const ArticleClientComponents: React.FC<{ title: string; url: string }> = ({
  title,
  url,
}) => {
  return (
    <>
      <ReadingProgressBar />
      <ShareBar title={title} url={url} />
    </>
  )
}
