import React from 'react'

import type { Page } from '@/payload-types'

import { FeaturedEventHero } from '@/heros/FeaturedEvent'
import { HeroCarousel } from '@/heros/HeroCarousel'
import { PageHero } from '@/heros/PageHero'

const heroes = {
  featuredEvent: FeaturedEventHero,
  heroCarousel: HeroCarousel,
  pageHero: PageHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type as keyof typeof heroes]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
