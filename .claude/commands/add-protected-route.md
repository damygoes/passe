---
description: Scaffold a new protected page under app/(protected)/ with the established layout pattern
---

Create a new protected route at `apps/web/app/[locale]/(protected)/$ARGUMENTS/page.tsx`.

Follow these rules exactly:
1. The route page is a **pure shell** — zero data fetching, zero logic, zero component definitions
2. The page file contains one delegation: `return <SomeView />`
3. The actual view lives in `apps/web/src/features/<feature>/views/<Name>View.tsx` — create it too
4. The view is a `'use client'` component that calls hooks from `@passe/hooks` for data
5. For dynamic params (e.g. `/trips/[id]`), the page can be `async` only to unwrap `params`:
   ```tsx
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params
     return <SomeView id={id} />
   }
   ```
6. **Never** put `auth()`, `currentUser()`, or any `@passe/db` imports in a protected page file
7. The page is automatically protected by `proxy.ts` — no need for auth checks in the page

Scaffold both the page file and the view stub, then list what the developer still needs to fill in.
