import React, { type CSSProperties } from 'react'

interface SiteLogoProps {
  src?: string | null
  alt?: string
  height?: number | null
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'auto' | 'high' | 'low'
}

const LOGO_ASPECT_RATIO = 3.2

export const SiteLogo: React.FC<SiteLogoProps> = ({
  src,
  alt = 'Beyond AI',
  height = 56,
  className = '',
  loading = 'lazy',
  fetchPriority = 'low',
}) => {
  const resolvedSrc = src || '/logo.png'
  const logoHeight = height ?? 56

  const style = { '--logo-h': `${logoHeight}px` } as CSSProperties

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={Math.round(logoHeight * LOGO_ASPECT_RATIO)}
      height={logoHeight}
      style={style}
      className={`site-logo ${className}`.trim()}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  )
}
