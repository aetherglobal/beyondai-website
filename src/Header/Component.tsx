import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getBranding } from '@/utilities/getBranding'
import React from 'react'

export async function Header() {
  const [headerData, { logoUrl, logoAlt, logoHeight }] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getBranding(),
  ])

  return (
    <HeaderClient
      data={headerData}
      logoUrl={logoUrl}
      logoAlt={logoAlt}
      logoHeight={logoHeight}
    />
  )
}
