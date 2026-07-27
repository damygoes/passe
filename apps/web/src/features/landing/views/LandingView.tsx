import { MotionProvider } from '@/components/motion/MotionProvider'
import { ArchiveStatSection } from '../components/ArchiveStatSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { FinalCtaSection } from '../components/FinalCtaSection'
import { FlightPathSpan } from '../components/FlightPathSpan'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { LandingExitProvider } from '../components/LandingExitProvider'
import { LandingFooter } from '../components/LandingFooter'
import { LandingHeader } from '../components/LandingHeader'
import { MobileAppSection } from '../components/MobileAppSection'
import { PricingSection } from '../components/PricingSection'
import { PrivacySection } from '../components/PrivacySection'
import { StatsBar } from '../components/StatsBar'

export function LandingView() {
  return (
    <MotionProvider>
      <LandingExitProvider>
        <div className="relative min-h-screen bg-background">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] overflow-hidden [mask-image:radial-gradient(45rem_32rem_at_0%_0%,black,transparent)]"
          >
            <div className="animate-drift absolute -top-32 -left-32 size-[40rem] rounded-full bg-terracotta/15 blur-3xl" />
          </div>
          <LandingHeader />
          <main>
            <FlightPathSpan>
              <HeroSection />
              <StatsBar />
              <FeaturesSection />
              <HowItWorksSection />
            </FlightPathSpan>
            <PrivacySection />
            <MobileAppSection />
            <ArchiveStatSection />
            <PricingSection />
            <FinalCtaSection />
          </main>
          <LandingFooter />
        </div>
      </LandingExitProvider>
    </MotionProvider>
  )
}
