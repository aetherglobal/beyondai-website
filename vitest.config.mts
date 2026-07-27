import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // `getPayload()` in beforeAll pulls the schema over the network — ~18s against a remote
    // database, well past Vitest's 10s hook default.
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
})
