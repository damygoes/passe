# apps/web — Next.js 16 App

Main Passé product. App Router, Clerk auth, Tailwind CSS 4.

---

## Auth setup

Auth is handled by `@clerk/nextjs` (installed) + `@passe/auth` (shared utilities).

### proxy.ts (middleware)

Next.js 16 uses `proxy.ts` instead of `middleware.ts`. It wraps `clerkMiddleware` and protects
all routes except those in `PUBLIC_ROUTES` (defined in `@passe/auth/constants`):

```
apps/web/proxy.ts
```

### Clerk webhook

`POST /api/webhooks/clerk` verifies the Clerk webhook signature and calls `syncClerkUser` from
`@passe/auth/webhook` to keep the `users` table in sync. Register this endpoint in the
[Clerk Dashboard → Webhooks](https://dashboard.clerk.com).

```
apps/web/app/api/webhooks/clerk/route.ts
```

### Server-side auth

In server components and actions, use `@clerk/nextjs/server`:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

// In an async server component:
const { userId } = await auth()
const user = await currentUser()
```

---

## Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → Signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `DATABASE_URL` | Neon Dashboard → Pooled connection string |

---

## Key rules

- `auth()` and `currentUser()` are async in Next.js 16 — always `await` them
- Never import `@clerk/nextjs/server` in client components (`'use client'`)
- `@passe/auth/webhook` is server-only (it initializes `@passe/db/client`) — only import in API routes or server actions
- Route protection is all-or-nothing via `proxy.ts` — individual pages do not need to call `auth.protect()` unless they need the redirect behavior

---

## External documentation

- [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [clerkMiddleware (proxy.ts)](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [auth() reference](https://clerk.com/docs/references/nextjs/auth)
- [currentUser() reference](https://clerk.com/docs/references/nextjs/current-user)
- [Next.js 16 docs](https://nextjs.org/docs)
