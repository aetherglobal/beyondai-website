type LinkLike = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  reference?:
    | {
        relationTo: 'pages' | 'posts' | string
        value:
          | {
              slug?: string | null
            }
          | number
          | string
          | null
      }
    | null
    | undefined
} | null | undefined

export function resolveLinkHref(link: LinkLike): string {
  if (!link) return '#'

  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = link.reference.value?.slug
    if (!slug) return '#'
    const prefix = link.reference.relationTo === 'pages' ? '' : `/${link.reference.relationTo}`
    return `${prefix}/${slug}`
  }

  return link.url || '#'
}
