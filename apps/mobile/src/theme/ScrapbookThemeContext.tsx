import { canUseThemes } from '@passe/auth/plan-gates'
import { useUser } from '@passe/hooks'
import { createContext, useContext, type ReactNode } from 'react'

const ScrapbookThemeContext = createContext(false)

// Scopes the user's opt-in scrapbook theme preference to a subtree, mirroring
// web's `UserThemeScope` (a data-theme wrapper around DashboardView/TripDetailView
// only). Wrap just the screens that should recolor — mounting this near the app
// root would make every `useTheme()` consumer app-wide re-render on every
// background refetch of the user query.
export function ScrapbookThemeProvider({ children }: { children: ReactNode }) {
  const { data: user } = useUser()
  const isScrapbook = user?.theme === 'scrapbook' && canUseThemes(user.plan)

  return (
    <ScrapbookThemeContext.Provider value={isScrapbook}>{children}</ScrapbookThemeContext.Provider>
  )
}

export function useIsScrapbookTheme(): boolean {
  return useContext(ScrapbookThemeContext)
}
