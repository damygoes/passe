# @passe/auth — Shared Auth Utilities

Shared Clerk authentication helpers for the Passé monorepo.
**Not** a full auth SDK — each app integrates Clerk directly. This package holds the glue:
framework-agnostic logic that would otherwise be duplicated across `apps/web` and `apps/mobile`.

---

## What lives here

| Export path             | File                    | What it does                                         |
| ----------------------- | ----------------------- | ---------------------------------------------------- |
| `@passe/auth`           | `src/index.ts`          | Barrel re-export of everything                       |
| `@passe/auth/types`     | `src/types.ts`          | `ClerkWebhookEvent`, `ClerkWebhookUser`, `PlanType`  |
| `@passe/auth/constants` | `src/constants.ts`      | Route strings + `PUBLIC_ROUTES` for web `proxy.ts`   |
| `@passe/auth/webhook`   | `src/webhook-handler.ts`| `syncClerkUser(event)` → upserts `@passe/db` users   |
| `@passe/auth/plan-gates`| `src/plan-gates.ts`     | `PLAN_LIMITS`, `canCreateTrip()`, `canAddMemory()`   |

## What does NOT live here

- `clerkMiddleware()` — stays in `apps/web/proxy.ts`
- `auth()`, `currentUser()` — Next.js server-only, stay in `apps/web` server components/actions
- `ClerkProvider` for Expo — stays in mobile app root layout
- `useAuth()`, `useUser()` — Expo hooks, stay in mobile components

---

## Webhook handler

`syncClerkUser` is the most important export. It processes Clerk's `user.created`,
`user.updated`, and `user.deleted` events and keeps the `users` table in `@passe/db` in sync.

**Call it from** `apps/web/app/api/webhooks/clerk/route.ts` after verifying the webhook:

```typescript
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { syncClerkUser } from '@passe/auth/webhook'

export async function POST(req: NextRequest) {
  const event = await verifyWebhook(req)   // @clerk/nextjs/webhooks — Next.js specific
  if (event.type === 'user.created' || event.type === 'user.updated' || event.type === 'user.deleted') {
    await syncClerkUser(event as unknown as ClerkWebhookEvent)
  }
  return new Response('OK', { status: 200 })
}
```

`verifyWebhook` uses `CLERK_WEBHOOK_SECRET` from env. Register the webhook endpoint in the
Clerk Dashboard → Webhooks → Add endpoint: `https://yourdomain.com/api/webhooks/clerk`

---

## Plan gates

```typescript
import { canCreateTrip, canAddMemory, PLAN_LIMITS } from '@passe/auth/plan-gates'

canCreateTrip('free', 3)      // false — free plan limit is 3
canAddMemory('explorer', 49)  // true — explorer limit is 50
PLAN_LIMITS.collector.maxTrips // Infinity
```

---

## Route constants (web only)

```typescript
import { PUBLIC_ROUTES, SIGN_IN_URL } from '@passe/auth/constants'
```

`PUBLIC_ROUTES` is a `readonly` tuple passed to Clerk's `createRouteMatcher` in `proxy.ts`.
Do NOT use web route constants in mobile — mobile uses its own deep-link navigation.

---

## Environment variables (apps/web)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Set these in `apps/web/.env.local`. Get the keys from the Clerk Dashboard.

---

## External documentation

- [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [clerkMiddleware API](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [Clerk Expo quickstart](https://clerk.com/docs/quickstarts/expo)
- [Webhooks overview](https://clerk.com/docs/webhooks/overview)
- [Syncing data with webhooks](https://clerk.com/docs/webhooks/sync-data)
