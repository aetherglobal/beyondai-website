import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

import { assertTestDatabase } from './assertTestDatabase'

export const testUser = {
  email: 'e2e-test-user@beyondai.test',
  password: 'e2e-test-password-not-for-production',
}

export async function seedTestUser(): Promise<void> {
  assertTestDatabase('seedTestUser')

  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: { email: { equals: testUser.email } },
  })

  await payload.create({
    collection: 'users',
    data: { ...testUser, role: 'admin' },
  })
}

export async function cleanupTestUser(): Promise<void> {
  assertTestDatabase('cleanupTestUser')

  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: { email: { equals: testUser.email } },
  })
}
