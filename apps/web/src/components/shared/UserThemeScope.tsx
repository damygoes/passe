'use client'

import { canUseThemes } from '@passe/auth/plan-gates'
import { useUser } from '@passe/hooks'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  // Lets callers put their own layout classes directly on the themed root
  // (e.g. DashboardView's page container) instead of nesting an extra div.
  className?: string
}

// Applies the current user's opt-in visual theme (editorial vs. scrapbook) to
// a subtree via a data-theme attribute — see the `scrapbook:` Tailwind
// variant in globals.css. Purely presentational; renders unthemed while the
// user record is loading, and silently falls back to editorial if the plan
// no longer permits custom themes (e.g. after a downgrade).
export function UserThemeScope({ children, className }: Props) {
  const { data: user } = useUser()
  const isScrapbook = user?.theme === 'scrapbook' && canUseThemes(user.plan)

  return (
    <div data-theme={isScrapbook ? 'scrapbook' : undefined} className={className}>
      {children}
    </div>
  )
}
