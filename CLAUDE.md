# Passé — AI Agent Context

> "The past, beautifully kept." — A travel memory sharing platform.

Users create **trips** (with dates, countries, cover images), attach geotagged **memories** (photos + notes) to them, and share **public portfolios**. Subscription plans (free / explorer / collector) gate features.

---

## Monorepo Structure

```text
apps/
  web/          Next.js 16 — main product (App Router, Clerk auth)
  docs/         Next.js 16 — documentation site
packages/
  auth/         @passe/auth    — shared Clerk auth utilities (webhook handler, plan gates, constants)
  db/           @passe/db      — Drizzle ORM schema + Neon serverless client
  ui/           @passe/ui      — shared React component library
  utils/        @passe/utils   — shared utilities (cn, and future helpers)
  theme/        @passe/theme   — design tokens (colors, spacing, typography)
  types/        @passe/types   — Zod schemas + inferred TypeScript types
  eslint-config/ @repo/eslint-config  — shared ESLint flat config
  typescript-config/ @repo/typescript-config — shared tsconfig bases
```

Package manager: **pnpm 9** | Build: **Turborepo 2** | Node: **≥20.9**

---

## Commands (run from repo root)

```bash
pnpm dev          # start all apps in dev mode
pnpm build        # build all packages and apps
pnpm lint         # lint everything (max-warnings 0)
pnpm check-types  # TypeScript check across the monorepo
pnpm format       # run Prettier
pnpm clean        # remove build artifacts
```

Run within a package:

```bash
pnpm --filter @passe/ui lint
pnpm --filter web dev
```

Generate a new UI component:

```bash
pnpm --filter @passe/ui generate:component
```

Browse the component library:

```bash
pnpm --filter @passe/ui storybook   # opens at localhost:6006
```

Database (`@passe/db`):

```bash
pnpm --filter @passe/db db:generate   # generate SQL migrations from schema changes
pnpm --filter @passe/db db:migrate    # apply pending migrations to the database
pnpm --filter @passe/db db:push       # push schema directly (dev only, no migrations)
pnpm --filter @passe/db db:studio     # open Drizzle Studio at localhost:4983
```

---

## Code Conventions

From `.prettierrc` — enforced across the whole repo:

- No semicolons
- Single quotes
- Trailing commas (ES5)
- 100-character line width
- 2-space indentation
- ES modules only (`import`/`export`, never `require`)

TypeScript: strict mode, `noEmit` for type-checks, `isolatedModules`.

---

## Architecture Rules

- Shared packages are consumed via **workspace imports**, never relative cross-package paths:
  - `import { Button } from '@passe/ui/button'`
  - `import { cn } from '@passe/utils'`
  - `import { UserSchema } from '@passe/types'`
  - `import '@passe/theme/styles'` in CSS
- `packages/ui` components must **not** import from `apps/*`
- `packages/types` must **not** import UI or theme packages
- CSS custom properties for brand colors come from `@passe/theme` — never hardcode hex values
- Database access goes through `@passe/db/client` — never connect to Neon directly from `apps/*`
- Import schema types (`DbUser`, `DbTrip`, `DbMemory`) from `@passe/db/schema` to avoid initializing the DB client in files that only need types
- `@passe/db` requires `DATABASE_URL` at runtime; set it in `apps/web/.env.local` using the Neon pooled connection string
- Clerk auth helpers (`auth()`, `currentUser()`, `clerkMiddleware`) are Next.js-specific — never import them from outside `apps/web`
- Shared auth logic (webhook sync, plan gates, route constants) lives in `@passe/auth` — import from there, not from `@clerk/*` directly in shared packages
- `@passe/auth/webhook` imports `@passe/db/client` and must only be used in server-side code (API routes, server actions) — never in client components or mobile UI

---

## Domain Model

```text
User (Clerk auth)
  ├── plan: 'free' | 'explorer' | 'collector'
  └── trips[]
        ├── countries[], startDate, endDate, isPublic
        └── memories[]
              ├── note?, photoUrl?
              └── location: { lat, lng }?, city?, country?
```

Key schemas live in `packages/types/src/`: `user.ts`, `trip.ts`, `memory.ts`.

---

## Brand Colors (Tailwind classes)

`terracotta`, `terracotta-dark`, `aged-cream`, `sandy-beige`, `sandy-beige-dark`, `dark-espresso`
These map to CSS custom properties defined by `@passe/theme`.

---

## Agent Rules

- Always use `cn()` from `@passe/utils` for conditional Tailwind classes — never string concatenation
- Always use CVA (`class-variance-authority`) for component variants, not conditional className logic
- Never import HugeIcons directly in `apps/*` — use `<Icon name="..." />` from `@passe/ui`
- New icons require two steps: add to `iconMap` in `packages/ui/src/icon/icon-map.ts`, then `IconName` type updates automatically
- Use `@passe/types` schemas for all data validation; infer TypeScript types with `z.infer<typeof Schema>`
- Named exports only in `packages/ui` — no default exports (Next.js pages are the exception)
- Do not add barrel `index.ts` re-exports per component folder — export directly from the component file
