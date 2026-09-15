# Passe.

> _A place for the memories worth keeping._

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

## Git hooks

[Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) run locally on every commit/push (installed automatically via the root `prepare` script on `pnpm install`):

- **pre-commit** — `lint-staged` runs Prettier and ESLint (scoped to `apps/web`, `apps/mobile`, `packages/ui`) against staged files only.
- **pre-push** — `pnpm test` (`turbo run test`) runs the full unit test suite across the monorepo.

## CI/CD

### Pipelines

`.github/workflows/ci.yml` runs as one gated sequence on PRs and pushes to `main`:

1. **`quality`** — lint → type-check → unit tests → build, as four sequential `turbo run` steps (fails fast on the first broken stage).
2. **`e2e`** (`needs: quality`) — builds `apps/web` and runs the Playwright suite.
3. **`deploy`** and **`eas-ota`** (both `needs: e2e`, run in parallel, `main`-only) — web deploy and mobile OTA update don't depend on each other, so an unrelated failure in one doesn't block the other.
   - **`deploy`** — `vercel pull` / `vercel build` / `vercel deploy --prod` via the Vercel CLI. Vercel's Git integration auto-deploy is disabled for `main` (via the project's Ignored Build Step) so this job is the only path to production; PR previews still deploy automatically through Vercel's Git integration.
   - **`eas-ota`** — publishes an OTA JS update to the EAS `production` channel, but only if the push touched mobile-relevant paths (checked with `dorny/paths-filter`, replacing what used to be a separate path-filtered workflow trigger).

| Workflow                           | Trigger                             | What it does                                                                                                 |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/ci.yml`         | PRs + push to `main`                | quality → e2e → (deploy \| eas-ota), see above                                                               |
| Vercel (Git integration)           | PRs only (preview)                  | Builds and deploys PR previews for `apps/web`; production deploys go through `ci.yml`'s `deploy` job instead |
| `.github/workflows/eas-update.yml` | Manual dispatch only                | Escape hatch to re-publish an OTA update outside the normal pipeline                                         |
| `.github/workflows/eas-build.yml`  | `mobile-v*` tags or manual dispatch | Queues EAS native builds and auto-submits (iOS → TestFlight, Android → Play)                                 |

The EAS jobs/workflows are gated on the `EAS_READY` repository variable — they show as _skipped_ until it is set to `true` (after `eas init` and credentials are configured).

### Required GitHub secrets & variables

- Secret `TURBO_TOKEN` + variable `TURBO_TEAM` — Turborepo remote cache (Vercel token + team slug)
- Secret `EXPO_TOKEN` — Expo access token for EAS workflows
- Secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — used by `ci.yml`'s `deploy` job to deploy `apps/web` via the Vercel CLI
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
