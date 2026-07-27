import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // `getPayload()` in a beforeAll hook has to open a Postgres connection and pull the
    // schema. Against a remote database that comfortably exceeds Vitest's 10s hook
    // default, which surfaced as "Hook timed out in 10000ms" rather than a real failure.
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
})
