import dotenv from 'dotenv'

import { assertTestDatabase } from './tests/helpers/assertTestDatabase'

dotenv.config({ path: 'test.env' })
dotenv.config()

assertTestDatabase('Integration tests')
