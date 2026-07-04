/// <reference types="node" />
import { defineConfig } from 'drizzle-kit'

// Production config — used only by db:migrate:prod / db:studio:prod.
// Reads DATABASE_URL_PROD (not DATABASE_URL) on purpose: drizzle-kit loads
// packages/db/.env with override behavior, so a same-named exported variable
// would silently lose to the dev URL in that file.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL_PROD!,
  },
})
