import { FeaturesSection } from '../components/FeaturesSection'
import { FinalCtaSection } from '../components/FinalCtaSection'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { LandingFooter } from '../components/LandingFooter'
import { LandingHeader } from '../components/LandingHeader'
import { PricingSection } from '../components/PricingSection'
import { PrivacySection } from '../components/PrivacySection'

export function LandingView() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PrivacySection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
