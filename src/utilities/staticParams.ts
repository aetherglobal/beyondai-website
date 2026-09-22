import type { CollectionSlug } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function collectSlugs(collection: CollectionSlug): Promise<{ slug: string }[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })

    return result.docs
      .map((doc) => (doc as { slug?: string | null }).slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ slug }))
  } catch (error) {
    console.warn(
      `generateStaticParams: could not read "${collection}", falling back to on-demand rendering.`,
      error instanceof Error ? error.message : error,
    )
    return []
  }
}
