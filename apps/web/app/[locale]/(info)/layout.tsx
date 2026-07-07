import { LandingFooter } from '@/features/landing/components/LandingFooter'
import { LandingHeader } from '@/features/landing/components/LandingHeader'
import type { ReactNode } from 'react'

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  )
}
