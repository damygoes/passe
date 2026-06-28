---
description: Scaffold a new protected page under app/(protected)/ with the established layout pattern
---

Create a new protected route at `apps/web/app/(protected)/$ARGUMENTS/page.tsx`.

Follow these rules exactly:
1. The file goes in `app/(protected)/<route-name>/page.tsx`
2. Export a default Server Component (no `'use client'` unless the page genuinely needs client state)
3. If the page needs the current user, use `auth()` from `@clerk/nextjs/server`:
   ```tsx
   import { auth } from '@clerk/nextjs/server'
   const { userId } = await auth()
   ```
4. For DB queries, import from `@passe/db/client` (server-only) or `@passe/db/schema` (types only)
5. Use Tailwind classes that reference the design system tokens (bg-background, text-foreground, text-primary, etc.) — never hardcode hex colors
6. The page is automatically protected by `proxy.ts` — no need to call `auth.protect()` in the page itself

Scaffold the file with a minimal working structure, then list what the developer still needs to fill in.
