'use client'

import React from 'react'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { ShareBar } from '@/components/ShareBar'

export const ArticleClientComponents: React.FC<{ title: string }> = ({ title }) => {
  return (
    <>
      <ReadingProgressBar />
      <ShareBar title={title} />
    </>
  )
}
