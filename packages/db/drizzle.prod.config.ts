/// <reference types="node" />
import { defineConfig } from 'drizzle-kit'

// Production config — used only by db:migrate:prod / db:studio:prod.
// Reads DATABASE_URL_PROD (not DATABASE_URL) on purpose: drizzle-kit loads
// packages/db/.env with override behavior, so a same-named exported variable
// would silently lose to the dev URL in that file.
// Strip wrapping quotes and whitespace: dotenv unquotes values read from
// .env, but a value injected via CI secret arrives verbatim — a quoted
// string would otherwise fail deep in the neon driver as a silent
// "Invalid URL" with drizzle-kit exiting 1 without printing the error.
const url = process.env.DATABASE_URL_PROD?.trim().replace(/^['"]|['"]$/g, '')
if (!url) throw new Error('DATABASE_URL_PROD is not set')

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './migrations',
  dbCredentials: {
    url,
  },
})
