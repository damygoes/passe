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
    ui/                   # RN UI primitives (mobile equivalent of @passe/ui)
      <name>/
        <Name>.tsx        # Component implementation
        <Name>.types.ts   # Props interface, variant/size union types
        index.ts          # Re-exports component + types
    layouts/              # Layout wrappers (SafeAreaLayout, etc.)
  hooks/                  # App-level hooks (useTheme, etc.)
  recipes/                # Component styling recipes (theme → StyleSheet)
    <name>.ts             # create<Name>Recipe(theme: AppTheme): <Name>Recipe
  theme/                  # Local theme system — wraps @passe/theme JS tokens
    colors.ts             # lightColors + darkColors (SemanticColors)
    spacing.ts            # Re-exports spacing + borderRadius from @passe/theme
    typography.ts         # Platform-aware fonts, fontSizes, fontWeights, resolveLineHeight()
    index.ts              # Assembles full theme const, exports ThemeDefinition type
  lib/                    # API helpers, route constants, utilities
```

---

## Architecture Rules

- `src/app/` is **routing only** — no logic, no hooks, no data fetching in route files. Every route file is a one-line shell: `export { ScreenName as default } from '@/features/<feature>/screens/<Name>Screen'`
- All screen logic lives in `src/features/<feature>/screens/<Name>Screen.tsx`
- Shared React Native UI primitives go in `src/components/ui/<name>/` — each with `<Name>.tsx`, `<Name>.types.ts`, and `index.ts` re-exporting both. Before using raw `TouchableOpacity` or `Text` wrappers in a feature, check the Component Library section below.
- Shared layout wrappers go in `src/components/layouts/<Name>Layout.tsx`
- Multi-variant component styles go in `src/recipes/<name>.ts` — never inline variant logic directly in a component file

---

## Component Library (`src/components/ui/`)

This is the mobile equivalent of `@passe/ui` (which cannot run in React Native). Before writing raw `TouchableOpacity` / `Text` wrappers inside a feature, check here first.

| Component | Import path | Variants / Sizes | Notes |
|-----------|-------------|-----------------|-------|
| `Button` | `@/components/ui/button` | variants: `primary`, `secondary`, `ghost`, `danger` · sizes: `sm`, `md`, `lg` | |
| `Icon` | `@/components/ui/icon` | sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`–`5xl` | Same icon names as `@passe/ui`; icon data from `@passe/ui/icon-map` |
| `Separator` | `@/components/ui/separator` | orientations: `horizontal`, `vertical` | |
| `Badge` | `@/components/ui/badge` | variants: `default`, `secondary`, `destructive`, `outline`, `ghost` | |
| `Skeleton` | `@/components/ui/skeleton` | — | Reanimated pulse; size via `style` prop |
| `Input` | `@/components/ui/input` | — | Supports `icon`, `iconPosition`, `isLoading`, `onIconPress`, `inputStyle` |
| `FormField` | `@/components/ui/form-field` | — | Wraps `Input` with a label, optional `labelRight` slot, and error text |
| `Textarea` | `@/components/ui/textarea` | — | Multiline `TextInput`, auto-grows |
| `Avatar` | `@/components/ui/avatar` | sizes: `sm`, `default`, `lg` | Sub-components: `Avatar`, `AvatarImage`, `AvatarFallback` |
| `Card` | `@/components/ui/card` | sizes: `default`, `sm` | Sub-components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `Empty` | `@/components/ui/empty` | — | Sub-components: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent` |
| `PageHeader` | `@/components/ui/page-header` | — | Sub-components: `PageHeader`, `PageHeaderTitle`, `PageHeaderDescription`, `PageHeaderAction` |
| `AlertDialog` | `@/components/ui/alert-dialog` | — | Controlled via `open`/`onOpenChange`; sub-components: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel` |
| `DropdownMenu` | `@/components/ui/dropdown-menu` | item variants: `default`, `destructive` | Sub-components: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuSeparator` |

> **Icon data sharing:** `@passe/ui` is a dependency of `apps/mobile` solely to import `@passe/ui/icon-map`. No other `@passe/ui` subpath may be used in mobile — all other exports are DOM-based and incompatible with React Native.

**Adding a new component:**

1. Create `src/components/ui/<name>/` with `<Name>.tsx`, `<Name>.types.ts`, and `index.ts`
2. Define all variant/size types in `<Name>.types.ts`
3. Create a matching recipe in `src/recipes/<name>.ts` (see Recipes section)
4. Re-export component + types from `index.ts`
5. Add it to this table

---

## Recipes (`src/recipes/`)

Recipes replace CVA (which is web/Tailwind-only) for multi-variant component styling on mobile. A recipe is a function that takes the current theme and returns a typed object of `StyleSheet` entries grouped by slot (`base`, `variants`, `sizes`, `states`).

**Pattern:**

```ts
// src/recipes/button.ts
interface ButtonRecipe {
  base: { container: ViewStyle; label: TextStyle }
  variants: Record<ButtonVariant, { container: ViewStyle; label: TextStyle; spinnerColor: string }>
  sizes: Record<ButtonSize, { container: ViewStyle; label: TextStyle }>
  states: { disabled: { container: ViewStyle }; fullWidth: { container: ViewStyle } }
}

export function createButtonRecipe(theme: AppTheme): ButtonRecipe { ... }
```

```tsx
// src/components/ui/button/Button.tsx
const recipe = createButtonRecipe(useTheme())
<TouchableOpacity style={[recipe.base.container, recipe.variants[variant].container, ...]} />
```

Rules:
- One recipe file per component — `src/recipes/<name>.ts` maps 1:1 to `src/components/ui/<name>/`
- Never define `StyleSheet.create()` calls with conditional variant logic inside a component file
- Each slot value must be a frozen `StyleSheet` entry (call `StyleSheet.create({ style: ... }).style`)

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

## Internationalization (`@passe/i18n`)

Mobile has no translation library of its own — `packages/i18n`'s locale JSON
(`en.json`/`de.json`) is the single source of truth shared with `apps/web`. `apps/mobile/src/i18n/`
wraps it in a small RN-native consumption layer modeled on `next-intl`'s API so the same mental
model carries across both apps:

- `src/i18n/locale.ts` — `detectDeviceLocale()` reads the device locale via `expo-localization`,
  falling back to `DEFAULT_LOCALE` if unsupported. No manual switcher UI yet.
- `src/i18n/I18nProvider.tsx` — wraps the root layout (outermost provider in `_layout.tsx`),
  provides the detected `locale` + that locale's `messages` via context.
- `src/i18n/useTranslations.ts` — `useTranslations(namespace)` returns a `t(key, values?)`
  function, resolving `${namespace}.${key}` against the JSON and formatting ICU syntax (e.g.
  `{email}` interpolation, `{count, plural, ...}`) via `intl-messageformat` — the same ICU engine
  `next-intl` uses on web, so shared strings render identically on both platforms.

```tsx
import { useTranslations } from '@/i18n/useTranslations'

const t = useTranslations('auth.form')
t('email_label')                 // "Email"
t('check_email_body', { email }) // "We sent a 6-digit code to {email}" → interpolated
```

Never hardcode user-facing copy — check `packages/i18n/src/locales/en.json` for an existing key
under `auth.*`/`trips.*`/etc. before adding a new one, and add the same key to `de.json` too.

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
- For components with multiple variants or sizes, define styles in `src/recipes/` (see Recipes section) — not inline in the component

```tsx
import { useTheme } from '@/hooks/useTheme'

export function MyComponent() {
  const { colors, spacing } = useTheme()
  const styles = StyleSheet.create({
    wrapper: { backgroundColor: colors.background, padding: spacing[4] },
  })
  return <View style={styles.wrapper} />
}
```

Or define static styles at the bottom of the file when theme tokens are not needed.

### Theme structure (`src/theme/`)

Never import directly from `src/theme/` in components — always go through `useTheme()`.

| File | Exports |
|---|---|
| `colors.ts` | `lightColors`, `darkColors` (`SemanticColors`) — Passé brand palette: `primary` (terracotta), `primaryForeground` (agedCream), `secondary` (sandyBeige), `secondaryForeground` (darkEspresso), `muted`, `mutedForeground`, `destructive`, etc. |
| `spacing.ts` | `spacing` (numeric scale), `borderRadius` — re-exported from `@passe/theme` |
| `typography.ts` | `fonts` (platform-aware font families), `fontSizes`, `fontWeights`, `lineHeights`, `resolveLineHeight(fontSize, multiplier)` |
| `index.ts` | Assembles the full `theme` const; exports `ThemeDefinition` type |

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
