import { FeaturesSection } from '../components/FeaturesSection'
import { FinalCtaSection } from '../components/FinalCtaSection'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { LandingFooter } from '../components/LandingFooter'
import { LandingHeader } from '../components/LandingHeader'
import { MobileAppSection } from '../components/MobileAppSection'
import { PricingSection } from '../components/PricingSection'
import { PrivacySection } from '../components/PrivacySection'
import { StatsBar } from '../components/StatsBar'

export function LandingView() {
  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] overflow-hidden [mask-image:radial-gradient(45rem_32rem_at_0%_0%,black,transparent)]"
      >
        <div className="animate-drift absolute -top-32 -left-32 size-[40rem] rounded-full bg-terracotta/15 blur-3xl" />
      </div>
      <LandingHeader />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <PrivacySection />
        <MobileAppSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
