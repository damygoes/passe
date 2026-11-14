# Passe

A place for the memories worth keeping.

Passe is a travel journal. You create a trip, add the photos and notes that matter, pin them
to where they happened, and end up with something closer to a travel book than a camera roll.

Everything is private by default. If you want to share, you can publish a portfolio page or
individual trips, but nothing goes public unless you choose it. There are no followers, likes
or feeds. It isn't a social network.

There's a free plan, plus two paid ones (Explorer and Collector) that unlock public sharing and
printable exports like PDF memory books, zines and postcards. More in [PRODUCT.md](./PRODUCT.md).

## Stack

- **Web:** Next.js 16 (App Router), Tailwind
- **Mobile:** Expo + Expo Router (iOS and Android)
- **Auth:** Clerk
- **Data:** Postgres on Neon, Drizzle ORM
- **Media:** S3 with presigned uploads
- **Maps:** MapLibre GL + MapTiler, shared across web and mobile
- **Payments:** Stripe (web), RevenueCat (mobile)
- **Monorepo:** pnpm workspaces + Turborepo

## Repo layout

```text
apps/
  web/       Next.js app
  mobile/    Expo app
packages/
  auth/      Clerk helpers, plan gates
  db/        Drizzle schema and Neon client
  hooks/     TanStack Query hooks shared by web and mobile
  i18n/      translations
  logger/    logging
  map/       shared map config
  theme/     design tokens
  types/     Zod schemas
  ui/        React components (web only)
  utils/     small shared helpers
  eslint-config/, typescript-config/
```

## Running it locally

You'll need Node 20.9+ and pnpm 9.

```bash
pnpm install
cp apps/web/.env.local.example apps/web/.env.local
cp apps/mobile/.env.local.example apps/mobile/.env.local
```

Fill in the env files. At minimum the web app needs Clerk keys and a `DATABASE_URL` (a Neon
pooled connection string). Then:

```bash
pnpm db:migrate
pnpm dev
```

The web app runs on `localhost:3000`. For mobile, I use dev builds rather than Expo Go:

```bash
pnpm --filter passe-mobile ios
pnpm --filter passe-mobile android
```

## Scripts

```bash
pnpm dev           # run everything
pnpm build         # build everything
pnpm lint          # lint (zero warnings allowed)
pnpm check-types   # typecheck
pnpm test          # unit tests
pnpm --filter passe-web test:e2e   # Playwright (needs real dev creds)
```

## Deploys

CI runs lint, types, tests, build and e2e on every PR. Merges to `main` deploy the web app to
Vercel and push an OTA update to the mobile app if mobile code changed. Native builds are cut
by tagging `mobile-vX.Y.Z`. The details are in `.github/workflows/`.
