import type { CollectionAfterReadHook } from 'payload'

const DEFAULT_AUTHOR_NAME = 'Beyond AI'

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }) => {
  if (doc?.authorName) {
    doc.populatedAuthors = [{ id: 'manual', name: doc.authorName }]
    return doc
  }

  if (Array.isArray(doc?.authors) && doc.authors.length > 0) {
    const ids = doc.authors
      .map((author: unknown) =>
        typeof author === 'object' && author ? (author as { id?: unknown }).id : author,
      )
      .filter((id: unknown) => id !== undefined && id !== null)

    if (ids.length > 0) {
      const { docs } = await req.payload.find({
        collection: 'users',
        where: { id: { in: ids } },
        depth: 0,
        limit: ids.length,
        pagination: false,
        req,
      })

      type FoundUser = (typeof docs)[number]
      const byId = new Map<string, FoundUser>(docs.map((user: FoundUser) => [String(user.id), user]))
      const ordered = ids
        .map((id: unknown) => byId.get(String(id)))
        .filter((user: FoundUser | undefined): user is FoundUser => Boolean(user))

      if (ordered.length > 0) {
        doc.populatedAuthors = ordered.map((user: FoundUser) => ({
          id: user.id,
          name: user.name,
        }))
      }
    }
  }

  if (doc && (!doc.populatedAuthors || doc.populatedAuthors.length === 0)) {
    doc.populatedAuthors = [{ id: 'manual', name: DEFAULT_AUTHOR_NAME }]
  }

  return doc
}
