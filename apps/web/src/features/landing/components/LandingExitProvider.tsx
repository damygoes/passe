'use client'

import { useRouter } from '@/i18n/navigation'
import { AnimatePresence, m } from 'motion/react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface LandingExitContextValue {
  requestExit: (href: string) => void
}

const LandingExitContext = createContext<LandingExitContextValue | null>(null)

export function useLandingExit() {
  const ctx = useContext(LandingExitContext)
  if (!ctx) throw new Error('useLandingExit must be used within LandingExitProvider')
  return ctx
}

const EXIT_TRANSITION = { duration: 0.35, ease: 'easeInOut' } as const

export function LandingExitProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [exitHref, setExitHref] = useState<string | null>(null)

  const requestExit = useCallback((href: string) => {
    setExitHref((current) => current ?? href)
  }, [])

  return (
    <LandingExitContext.Provider value={{ requestExit }}>
      {children}
      <AnimatePresence>
        {exitHref && (
          <m.div
            aria-hidden
            className="fixed inset-0 z-50 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={EXIT_TRANSITION}
            onAnimationComplete={() => router.push(exitHref)}
          />
        )}
      </AnimatePresence>
    </LandingExitContext.Provider>
  )
}
