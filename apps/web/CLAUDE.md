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
| `DATABASE_URL` | Neon Dashboard → Pooled connection string |

---

## Custom auth pages

All auth pages use custom forms (not Clerk's hosted components). Forms live in
`src/features/auth/components/` and use React Hook Form + Zod. Clerk hooks provide the auth logic.

| Component | File | Purpose |
|---|---|---|
| `SignInForm` | `src/features/auth/components/SignInForm.tsx` | Email + password sign-in |
| `SignUpForm` | `src/features/auth/components/SignUpForm.tsx` | Sign-up with display name + OTP verification step |
| `ForgotPasswordForm` | `src/features/auth/components/ForgotPasswordForm.tsx` | Email entry → sends reset code |
| `ResetPasswordForm` | `src/features/auth/components/ResetPasswordForm.tsx` | OTP code + new password |
| `SocialAuthButtons` | `src/features/auth/components/SocialAuthButtons.tsx` | Google + Apple OAuth |

Zod schemas for all forms: `src/features/auth/schemas/auth.ts`

### Sign-in flow
1. Email + password → `signIn.create()`
2. If `status === 'complete'` → `setActive()` → redirect to dashboard
3. If `status === 'needs_client_trust'` or `'needs_second_factor'` → `prepareSecondFactor({ strategy: 'email_code' })` → OTP step → `attemptSecondFactor()` → `setActive()` → redirect

### Sign-up flow (two steps)
1. User fills display name + email + password → `signUp.create()` + `prepareEmailAddressVerification()`
2. OTP input shown → `signUp.attemptEmailAddressVerification()` → `setActive()` → redirect

### Social auth
Social OAuth (`oauth_google`, `oauth_apple`) uses `signIn.authenticateWithRedirect()` with
`redirectUrl: '/sso-callback'`. The `/sso-callback` page runs `AuthenticateWithRedirectCallback`
which completes the OAuth flow. Both `/sso-callback` and `/forgot-password`, `/reset-password`
are in `PUBLIC_ROUTES` (see `packages/auth/src/constants.ts`).

### Password reset flow
1. `/forgot-password` → email form → `signIn.create({ strategy: 'reset_password_email_code' })`
2. Email stored in `sessionStorage('reset-email')` → redirect to `/reset-password`
3. `/reset-password` → OTP + new password → `signIn.attemptFirstFactor()` → `setActive()`

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
