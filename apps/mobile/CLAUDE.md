> Expo HAS CHANGED — Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# apps/mobile — Passé Mobile App

Expo SDK 57, Expo Router (file-based routing), React Native 0.86, TypeScript 6 (strict), `@clerk/expo` for auth.

**Full product identity:** See [`PRODUCT.md`](../../PRODUCT.md) at the repo root.

---

## Directory Structure

```
src/
  app/                    # Expo Router routes — routing only, no logic (mirrors apps/web/app/)
    _layout.tsx           # Root layout — ClerkProvider + PasseApiProvider + QueryClientProvider
    (auth)/               # Unauthenticated route group
      _layout.tsx         # Stack navigator for auth screens
      sign-in.tsx         # → features/auth/screens/SignInScreen
      sign-up.tsx         # → features/auth/screens/SignUpScreen
      forgot-password.tsx # → features/auth/screens/ForgotPasswordScreen
    (app)/                # Authenticated route group
      _layout.tsx         # Tab navigator (Trips, Map, Account) + auth guard
      trips/
        index.tsx         # → features/trips/screens/TripsScreen
        [id].tsx          # → features/trips/screens/TripDetailScreen
        new.tsx           # → features/trips/screens/NewTripScreen
      map/
        index.tsx         # → features/map/screens/MapScreen
      account/
        index.tsx         # → features/account/screens/AccountScreen
  features/               # Domain-driven vertical slices
    auth/
      screens/            # AuthScreen components
      components/         # Auth-specific UI (forms, inputs)
      schemas/            # Zod form schemas
    trips/
      screens/            # TripScreen components
      components/         # Trip-specific UI (TripCard, MemoryCard, etc.)
      utils/              # Pure helpers (getUniqueCities, etc.)
    map/
      screens/
      components/
    account/
      screens/
      components/
  components/             # Shared native UI components
    layouts/              # Layout wrappers (SafeAreaLayout, etc.)
  hooks/                  # App-level hooks (useTheme, etc.)
  theme/                  # Local theme system — wraps @passe/theme JS tokens
  lib/                    # API helpers, route constants, utilities
```

---

## Architecture Rules

- `src/app/` is **routing only** — no logic, no hooks, no data fetching in route files. Every route file is a one-line shell: `export { ScreenName as default } from '@/features/<feature>/screens/<Name>Screen'`
- All screen logic lives in `src/features/<feature>/screens/<Name>Screen.tsx`
- Shared native components go in `src/components/<name>/<Name>.tsx`
- Shared layout wrappers go in `src/components/layouts/<Name>Layout.tsx`

---

## Navigation

Two route groups under `src/app/`:

- `(auth)/` — unauthenticated screens (sign-in, sign-up, forgot-password). Stack layout. Redirect here if `!isSignedIn`.
- `(app)/` — authenticated screens with a bottom tab navigator (Trips, Map, Account). Each tab has its own nested stack.

Auth guard lives in `src/app/(app)/_layout.tsx`:

```tsx
import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/expo'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />
  return <Tabs />
}
```

---

## Authentication (`@clerk/expo`)

- `ClerkProvider` wraps the root `src/app/_layout.tsx`
- Use `useAuth()` and `useUser()` from `@clerk/expo` inside screens and components
- `getToken()` from `useAuth()` provides the bearer token for API calls (pass to `PasseApiProvider`)
- Never import Clerk server helpers (`auth()`, `currentUser()`, `clerkMiddleware`) — those are Next.js-only
- Never import from `@clerk/nextjs` or `@clerk/nextjs/server`

---

## API / Data Fetching

All data fetching goes through `@passe/hooks` (TanStack Query v5) which calls the web app's API routes.

**Root layout setup:**

```tsx
import { useAuth } from '@clerk/expo'
import { PasseApiProvider } from '@passe/hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout() {
  const { getToken } = useAuth()
  return (
    <QueryClientProvider client={queryClient}>
      <PasseApiProvider baseUrl={process.env.EXPO_PUBLIC_API_URL!} getToken={getToken}>
        <Stack />
      </PasseApiProvider>
    </QueryClientProvider>
  )
}
```

- `EXPO_PUBLIC_API_URL` must be set in `.env.local` (e.g. `https://yourapp.com` in production, `http://localhost:3000` in dev)
- Never access `@passe/db` — all DB operations must go through the web app's API routes

---

## Styling

- All styles via `StyleSheet.create()` + theme tokens from `useTheme()` — never recurring raw inline objects
- Never use `cn()` — there are no Tailwind class strings on mobile
- All colors, spacing, typography, and borderRadius come from `useTheme()` → `src/theme/index.ts`
- Dark mode is automatic: `useTheme()` reads `useColorScheme()` and returns the correct token set

```tsx
import { useTheme } from '@/hooks/useTheme'

export function MyComponent() {
  const { colors, spacing, typography } = useTheme()
  return <View style={styles.container(colors, spacing)} />
}

const styles = {
  container: (colors: Colors, spacing: Spacing) =>
    StyleSheet.create({
      wrapper: { backgroundColor: colors.background, padding: spacing.md },
    }).wrapper,
}
```

Or define static styles at the bottom of the file when theme tokens are not needed.

---

## Shared Packages — What to Use and How

| Package | Import path | Notes |
|---|---|---|
| `@passe/types` | `@passe/types/trip`, `@passe/types/memory`, `@passe/types/user` | Zod schemas + inferred TS types; always validate API responses |
| `@passe/hooks` | `@passe/hooks` | `PasseApiProvider` + all data hooks |
| `@passe/auth/plan-gates` | `@passe/auth/plan-gates` | `canCreateTrip()`, `canAddMemory()`, `PLAN_LIMITS` for plan-gating UI |
| `@passe/auth/types` | `@passe/auth/types` | Shared auth TypeScript types |
| `@passe/auth/constants` | `@passe/auth/constants` | `PUBLIC_ROUTES` and other constants |
| `@passe/i18n` | `@passe/i18n` | `LOCALES`, `DEFAULT_LOCALE`, `messages` (raw JSON for i18n setup) |
| `@passe/logger` | `@passe/logger` | File-scoped logger instances; `debug` for lifecycle, `error` for failures |
| `@passe/theme` | `@passe/theme` | JS token objects only — `colors`, `spacing`, `typography` |
| `@passe/utils` | `@passe/utils` | `formatTripDate`, `formatDateRange`, other pure date utilities |

---

## What NOT to Import on Mobile

- `@passe/ui` — DOM-based (Base UI + react-dom), will not run in React Native
- `@passe/db` — Node.js / Drizzle ORM, server-only
- `@passe/theme/styles` — CSS file, web-only; import JS token exports instead
- `@passe/auth` (barrel) — the default export re-exports the webhook handler which imports `@passe/db`. Always import from subpaths: `@passe/auth/plan-gates`, `@passe/auth/types`, `@passe/auth/constants`
- `@clerk/nextjs` or `@clerk/nextjs/server` — Next.js-only

---

## Code Conventions

Same as the monorepo:

- No semicolons, single quotes, trailing commas, 100-char line width, 2-space indent, ES modules only
- Named exports only — **screens are the one exception** (Expo Router requires a default export from route files)
- Import alias: `@/` → `src/` (configured in `tsconfig.json`)
- Use `@passe/types` schemas to validate all data from API responses with `z.infer<typeof Schema>`
- Use full domain names in array callbacks — `.map(trip => ...)` not `.map(t => ...)`
