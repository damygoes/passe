import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: { '@': path.join(dirname, 'src') },
          dedupe: ['react', 'react-dom'],
        },
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/lib/**/*.test.ts'],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
        },
      },
      {
        resolve: {
          alias: { '@': path.join(dirname, 'src') },
        },
        test: {
          // Server-only code (API routes + src/lib helpers) — real Node runtime so
          // Response.json()/fetch match production, unlike happy-dom's partial polyfills.
          name: 'api',
          environment: 'node',
          include: ['app/api/**/*.test.ts', 'src/lib/**/*.test.ts'],
          // @passe/db's client.ts throws at import time without DATABASE_URL. Route tests
          // mock `db` itself but still import the real schema table objects (via
          // importOriginal) so drizzle-orm's eq()/and()/etc. get real Column instances —
          // this placeholder just needs to be present, never a real connection is made.
          env: { DATABASE_URL: 'postgres://user:pass@localhost:5432/test' },
        },
      },
    ],
  },
});
