import { describe, it, expect } from 'vitest'

import { isAdmin, isAdminField, isAdminOrSelf } from '@/access/isAdmin'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

const req = (user: unknown) => ({ req: { user } }) as never

const admin = { id: 1, email: 'a@b.com', role: 'admin' }
const editor = { id: 2, email: 'c@d.com', role: 'editor' }
const roleless = { id: 3, email: 'e@f.com' }

describe('isAdmin', () => {
  it('admits only users whose role is admin', () => {
    expect(isAdmin(req(admin))).toBe(true)
    expect(isAdmin(req(editor))).toBe(false)
    expect(isAdmin(req(null))).toBe(false)
  })

  it('denies a user with no role, so an unmigrated row is not treated as an admin', () => {
    expect(isAdmin(req(roleless))).toBe(false)
  })
})

describe('isAdminField', () => {
  it('prevents an editor from writing their own role', () => {
    expect(isAdminField(req(editor))).toBe(false)
    expect(isAdminField(req(admin))).toBe(true)
  })
})

describe('isAdminOrSelf', () => {
  it('lets an admin act on anyone', () => {
    expect(isAdminOrSelf(req(admin))).toBe(true)
  })

  it('scopes an editor to their own document', () => {
    expect(isAdminOrSelf(req(editor))).toEqual({ id: { equals: 2 } })
  })

  it('denies anonymous callers', () => {
    expect(isAdminOrSelf(req(null))).toBe(false)
  })
})

describe('baseline access functions', () => {
  it('authenticated tracks presence of a user only', () => {
    expect(authenticated(req(editor))).toBe(true)
    expect(authenticated(req(null))).toBe(false)
  })

  it('anyone is unconditionally open', () => {
    expect(anyone(req(null))).toBe(true)
  })

  it('authenticatedOrPublished filters anonymous reads to published documents', () => {
    expect(authenticatedOrPublished(req(editor))).toBe(true)
    expect(authenticatedOrPublished(req(null))).toEqual({ _status: { equals: 'published' } })
  })
})
