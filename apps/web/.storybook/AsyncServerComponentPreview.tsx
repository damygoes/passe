'use client'

import { Suspense, use, useMemo, type ReactNode } from 'react'

interface Props<P extends object> {
  component: (props: P) => Promise<ReactNode>
  props: P
}

// This Storybook environment renders stories as plain client components — it
// does not run Next.js's RSC pipeline, so `async function Component()` server
// components can't be used directly as JSX (React throws "only Server
// Components can be async"). This resolves the async component's promise
// once via `use()` so its real logic (including the mocked getTranslations)
// still runs, without needing an actual RSC render pipeline.
function Resolved<P extends object>({ component, props }: Props<P>) {
  const promise = useMemo(() => component(props), [component, props])
  return use(promise)
}

export function AsyncServerComponentPreview<P extends object>({ component, props }: Props<P>) {
  return (
    <Suspense fallback={null}>
      <Resolved component={component} props={props} />
    </Suspense>
  )
}
