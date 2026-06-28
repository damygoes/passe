# @passe/db

Drizzle ORM schema definitions and Neon serverless database client for the Passé platform.

---

## Package exports

| Path               | File                  | Use when                                        |
| ------------------ | --------------------- | ----------------------------------------------- |
| `@passe/db`        | `src/index.ts`        | You need both the db client AND schema in scope |
| `@passe/db/schema` | `src/schema/index.ts` | You only need schema types (no DB connection)   |
| `@passe/db/client` | `src/client.ts`       | You need the db client directly                 |

**Important:** `@passe/db` and `@passe/db/client` both initialize the Neon connection at module
load time and throw immediately if `DATABASE_URL` is not set. Use `@passe/db/schema` in files
that only need TypeScript types (e.g. server actions that receive already-fetched data).

---

## Environment variables

| Variable       | File                  | Used by                              |
| -------------- | --------------------- | ------------------------------------ |
| `DATABASE_URL` | `packages/db/.env`    | drizzle-kit CLI commands             |
| `DATABASE_URL` | `apps/web/.env.local` | Next.js app at runtime               |

Both must use the **pooled** connection string from Neon (HTTP mode via `@neondatabase/serverless`).
Do not use the direct connection string.

drizzle-kit loads `.env` from the directory where the command runs (`packages/db/`). Copy
`.env.example` → `.env` and fill in your Neon pooled connection string before running any
`db:*` commands.

---

## Database commands

Run from repo root:

```bash
pnpm --filter @passe/db db:generate   # introspect src/schema and write SQL to ./drizzle/
pnpm --filter @passe/db db:migrate    # apply ./drizzle/*.sql migrations to DATABASE_URL
pnpm --filter @passe/db db:push       # push schema directly without migrations (dev only)
pnpm --filter @passe/db db:studio     # open Drizzle Studio GUI at localhost:4983
```

---

## Schema

Three tables: `users`, `trips`, `memories`.

| Table      | PK type | Notable columns                               |
| ---------- | ------- | --------------------------------------------- |
| `users`    | text    | Clerk user ID; planEnum (free/explorer/collector) |
| `trips`    | uuid    | countries text[], isPublic bool, cascade → users  |
| `memories` | uuid    | lat/lng real, cascade → trips AND users           |

### Schema notes

- `updatedAt` uses `.$onUpdate(() => new Date())` — this is an ORM-level hook, not a DB trigger. It fires automatically on Drizzle `.update()` calls but NOT on raw SQL updates.
- FK columns `trips.user_id`, `memories.trip_id`, and `memories.user_id` have explicit indexes for common query patterns.
- Timestamps are timezone-naive (UTC). For `trips.startDate`/`endDate`, consider `{ withTimezone: true }` if local travel date semantics matter in the future.

---

## Adding a new table

1. Create `src/schema/your-table.ts`
2. Export it from `src/schema/index.ts`
3. Run `pnpm --filter @passe/db db:generate` to create the migration SQL
4. Run `pnpm --filter @passe/db db:migrate` to apply it

---

## drizzle.config.ts

The `drizzle.config.ts` at the package root is consumed exclusively by drizzle-kit's own bundler.
It is NOT compiled by `tsc` and is NOT in `tsconfig.json`'s `include`. Do not move it into `src/`.

---

## External documentation

- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit (migrations CLI)](https://orm.drizzle.team/docs/kit-overview)
- [Drizzle + Neon guide](https://orm.drizzle.team/docs/connect-neon)
- [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver)
- [Neon documentation](https://neon.tech/docs)
- [Vercel + Neon integration](https://vercel.com/integrations/neon)
