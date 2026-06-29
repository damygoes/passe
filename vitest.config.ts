import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/auth/vitest.config.ts',
      'packages/utils/vitest.config.ts',
      'packages/types/vitest.config.ts',
      'packages/hooks/vitest.config.ts',
      'packages/logger/vitest.config.ts',
    ],
  },
})
