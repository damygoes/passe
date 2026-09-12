---
name: verify
description: Verify Passe changes end-to-end against the running dev servers (web on :3000, Metro on :8081, booted iOS simulator)
---

# Verifying Passe changes

## Handles

- **Web**: the user usually has `next dev` running on port 3000 (Next 16 refuses a
  second dev server for the same dir — reuse it; it hot-reloads). Its error log:
  `apps/web/.next/dev/logs/next-development.log` (JSON lines, includes browser-side
  logs relayed by `@passe/logger`).
- **Mobile**: Metro on port 8081 + Expo Go on a booted simulator
  (`xcrun simctl list devices | grep Booted`). The simulator usually has a live
  signed-in Clerk session. No touch automation available — deep link + screenshot only:
  ```bash
  xcrun simctl openurl booted "exp://127.0.0.1:8081/--/trips/<id>"   # route groups stripped
  xcrun simctl io booted screenshot out.png
  ```
  Deep-linked authed screens do real API calls — good for verifying GET flows end to end.

## Auth constraints

- Protected web pages/APIs need a Clerk session. Minting session tokens via the Clerk
  backend API is blocked by the permission classifier — don't attempt it; leave authed
  browser click-throughs to the user, or verify authed flows via the simulator's session.
- Unauthenticated probes are still useful: protected pages 307 → `/en/sign-in`,
  API routes 401.

## Database — CRITICAL

`packages/db/.env` and `apps/web/.env.local` may point to **different Neon instances**.
The web app runs against `apps/web/.env.local`'s `DATABASE_URL`; `pnpm --filter @passe/db
db:migrate` uses `packages/db/.env`. Always confirm the hosts match before trusting a
migration reached the running app. drizzle-kit ignores an exported `DATABASE_URL` when
`packages/db/.env` exists — apply SQL manually via `@neondatabase/serverless` (split the
migration file on `--> statement-breakpoint`, then insert the file's sha256 into
`drizzle.__drizzle_migrations`) if you must target the other instance.

## Fixtures

Insert rows directly with `@neondatabase/serverless` + dotenv (`config({ path:
'apps/web/.env.local' })`). Public pages (`/u/[slug]`, `/u/[slug]/trips/[id]`) render
server-side from the DB — good no-auth surface. Clean fixtures up afterwards (trips
cascade to memories → memory_media).
