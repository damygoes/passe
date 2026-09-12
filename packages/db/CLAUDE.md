# @passe/db

Drizzle ORM schema definitions and Neon serverless database client for the Passe platform.

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

## Environment variables — two databases

There are **two Neon instances**: development and production.

| Variable            | File                  | Points at   | Used by                                   |
| ------------------- | --------------------- | ----------- | ----------------------------------------- |
| `DATABASE_URL`      | `packages/db/.env`    | development | everyday drizzle-kit commands             |
| `DATABASE_URL`      | `apps/web/.env.local` | development | Next.js app at runtime (must match above) |
| `DATABASE_URL_PROD` | `packages/db/.env`    | production  | `db:migrate:prod` / `db:studio:prod` only |
| `PROD_DATABASE_URL` | GitHub repo secret    | production  | `.github/workflows/db-migrate.yml`        |

All must be the **pooled** connection string from Neon (HTTP mode via `@neondatabase/serverless`).
Do not use the direct connection string.

**Why two variable names:** drizzle-kit loads `packages/db/.env` with override behavior — an
exported `DATABASE_URL` silently loses to the file's value. Production therefore uses a distinct
variable (`DATABASE_URL_PROD`) read by a separate config (`drizzle.prod.config.ts`), so a prod
command can never accidentally hit dev and vice versa.

`packages/db/.env` **must always keep `DATABASE_URL` = the same dev database the web app uses**
(`apps/web/.env.local`). If these ever diverge, migrations will apply to a database the app
doesn't read and the app will 500 on new tables.

---

## Database commands

Run from repo root:

```bash
pnpm --filter @passe/db db:generate       # introspect src/schema and write SQL to ./migrations/
pnpm --filter @passe/db db:migrate        # apply pending migrations to DEVELOPMENT
pnpm --filter @passe/db db:push           # push schema directly (dev only, no migrations)
pnpm --filter @passe/db db:studio         # Drizzle Studio GUI against DEVELOPMENT
pnpm --filter @passe/db db:migrate:prod   # apply pending migrations to PRODUCTION (rarely needed locally — CI does this)
pnpm --filter @passe/db db:studio:prod    # Drizzle Studio against PRODUCTION (read with care)
```

### Schema-change workflow (dev → prod)

1. Edit `src/schema/*.ts`
2. `db:generate` — writes a new SQL file to `./migrations/` (hand-edit only for data backfills)
3. `db:migrate` — applies it to **development**; test the app against it
4. Commit the migration files together with the schema change
5. Merge to `main` — the **`DB Migrate (production)`** GitHub Action detects changes under
   `packages/db/migrations/**` and runs `db:migrate:prod` against production automatically
   (also triggerable manually via `gh workflow run db-migrate.yml`)

Never run `db:push` against production — it bypasses the migration journal.

---

## Schema

Three tables: `users`, `trips`, `memories`.

| Table      | PK type | Notable columns                                   |
| ---------- | ------- | ------------------------------------------------- |
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
