# Passé — Mobile

Expo Router app for Passé. See [`CLAUDE.md`](./CLAUDE.md) in this directory for architecture,
conventions, and the component library. Full product identity: [`PRODUCT.md`](../../PRODUCT.md)
at the repo root.

## Get started

From the repo root (this app is part of a pnpm/Turborepo monorepo — do not `npm install` inside
`apps/mobile` directly):

```bash
pnpm install
pnpm --filter passe-mobile start     # start Expo dev server
pnpm --filter passe-mobile ios       # run on iOS simulator
pnpm --filter passe-mobile android   # run on Android emulator
```

You'll need `EXPO_PUBLIC_API_URL` set in `apps/mobile/.env.local` (e.g. `http://localhost:3000`
in dev) and Clerk keys — see `CLAUDE.md` for the full list.

## Learn more

- [Expo docs (pin to v57)](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction)
