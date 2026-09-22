import { describe, it, expect } from 'vitest'
import { ValidationError } from 'payload'

import {
  enforcePasswordPolicy,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '@/collections/Users/hooks/enforcePasswordPolicy'

const run = (data: Record<string, unknown>) =>
  enforcePasswordPolicy({ data, operation: 'create' } as never)

describe('enforcePasswordPolicy', () => {
  it('rejects a password below the NIST 800-63B Rev 4 floor', () => {
    expect(() => run({ password: 'test' })).toThrow(ValidationError)
    expect(() => run({ password: 'a'.repeat(MIN_PASSWORD_LENGTH - 1) })).toThrow(ValidationError)
  })

  it('accepts a passphrase at or above the minimum', () => {
    expect(() => run({ password: 'a'.repeat(MIN_PASSWORD_LENGTH) })).not.toThrow()
    expect(() => run({ password: 'correct horse battery staple' })).not.toThrow()
  })

  it('imposes no composition rules, which Rev 4 prohibits', () => {
    expect(() => run({ password: 'alllowercaseletters' })).not.toThrow()
  })

  it('rejects a password beyond the maximum', () => {
    expect(() => run({ password: 'a'.repeat(MAX_PASSWORD_LENGTH + 1) })).toThrow(ValidationError)
  })

  it('ignores updates that do not touch the password', () => {
    expect(() => run({ name: 'Ada' })).not.toThrow()
    expect(() => run({ password: '' })).not.toThrow()
    expect(() => run({})).not.toThrow()
  })
})
