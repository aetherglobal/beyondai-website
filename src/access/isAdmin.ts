import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

const hasAdminRole = (user: unknown): boolean =>
  Boolean(user && (user as User).role === 'admin')

export const isAdmin: Access = ({ req: { user } }) => hasAdminRole(user)

export const isAdminField: FieldAccess = ({ req: { user } }) => hasAdminRole(user)

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasAdminRole(user)) return true

  return { id: { equals: user.id } }
}
