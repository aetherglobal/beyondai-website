import dotenv from 'dotenv'

import { assertTestDatabase } from './helpers/assertTestDatabase'
import { seedFixture } from './helpers/seedFixture'

export default async function globalSetup() {
  dotenv.config({ path: 'test.env', override: !process.env.CI })
  dotenv.config()

  assertTestDatabase('E2E tests')
  await seedFixture()
}
