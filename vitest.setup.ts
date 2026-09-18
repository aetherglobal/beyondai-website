import dotenv from 'dotenv'

import { assertTestDatabase } from './tests/helpers/assertTestDatabase'

dotenv.config({ path: 'test.env', override: !process.env.CI })
dotenv.config()

assertTestDatabase('Integration tests')
