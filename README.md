# Passé.

> _The past, beautifully kept._

A personal travel portfolio app. Users create **trips**, attach **memories** (photos, notes, GPS
locations), and optionally share trips and memories publicly via a personal portfolio URL.

- **Full product identity, brand, monetisation tiers:** [`PRODUCT.md`](./PRODUCT.md)
- **Codebase conventions, architecture rules, commands:** [`CLAUDE.md`](./CLAUDE.md)

## Monorepo structure

```text
apps/
  web/          Next.js 16 — main product (App Router, Clerk auth)
  mobile/       Expo 57 + Expo Router — iOS & Android app (Clerk auth, React Native)
packages/
  auth/         @passe/auth    — shared Clerk auth utilities (webhook handler, plan gates, constants)
  db/           @passe/db      — Drizzle ORM schema + Neon serverless client
  hooks/        @passe/hooks   — shared TanStack Query API hooks (web + mobile)
  i18n/         @passe/i18n    — shared translation JSON files + locale constants (no framework deps)
  ui/           @passe/ui      — shared React component library (web only)
  utils/        @passe/utils   — shared utilities (cn, date formatters)
  theme/        @passe/theme   — design tokens (colors, spacing, typography)
  types/        @passe/types   — Zod schemas + inferred TypeScript types
  eslint-config/ @passe/eslint-config  — shared ESLint flat config
  typescript-config/ @passe/typescript-config — shared tsconfig bases
```

Package manager: **pnpm 9** | Build: **Turborepo 2** | Node: **≥20.9**

## Commands

```bash
pnpm dev          # start all apps in dev mode
pnpm build        # build all packages and apps
pnpm lint         # lint everything (max-warnings 0)
pnpm check-types  # TypeScript check across the monorepo
pnpm format       # run Prettier
pnpm clean        # remove build artifacts
```

Run within a package: `pnpm --filter <name> <script>` (e.g. `pnpm --filter web dev`).

## CI/CD

### Pipelines

| Workflow                             | Trigger                                        | What it does                                                                    |
| ------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`           | PRs + push to `main`                           | `turbo run lint check-types test build` across the monorepo                     |
| Vercel (Git integration)             | PRs (preview) + push to `main` (production)    | Builds and deploys `apps/web`; `npx turbo-ignore` skips unaffected pushes       |
| `.github/workflows/eas-update.yml`   | Push to `main` touching mobile-relevant paths  | Publishes an OTA JS update to the EAS `production` channel                      |
| `.github/workflows/eas-build.yml`    | `mobile-v*` tags or manual dispatch            | Queues EAS native builds and auto-submits (iOS → TestFlight, Android → Play)    |

The EAS workflows are gated on the `EAS_READY` repository variable — they show as *skipped* until it is set to `true` (after `eas init` and credentials are configured).

### Required GitHub secrets & variables

- Secret `TURBO_TOKEN` + variable `TURBO_TEAM` — Turborepo remote cache (Vercel token + team slug)
- Secret `EXPO_TOKEN` — Expo access token for EAS workflows
- Variable `EAS_READY=true` — activates the EAS workflows

### Mobile releases

```sh
git tag mobile-v1.0.0 && git push origin mobile-v1.0.0   # native build + store submit
```

JS-only changes reach installed apps automatically via EAS Update when merged to `main`.

### Local remote-cache setup (one-time)

```sh
npx turbo login
npx turbo link
```

## Useful links

- [Turborepo docs](https://turborepo.dev/docs)
- [Next.js docs](https://nextjs.org/docs)
- [Expo docs](https://docs.expo.dev/versions/v57.0.0/)
