import { MotionProvider } from '@/components/motion/MotionProvider'
import { FaqSection } from '../components/FaqSection'
import { FinalCtaSection } from '../components/FinalCtaSection'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { LandingExitProvider } from '../components/LandingExitProvider'
import { LandingFooter } from '../components/LandingFooter'
import { LandingHeader } from '../components/LandingHeader'
import { PricingSection } from '../components/PricingSection'
import { ProofStrip } from '../components/ProofStrip'
import { TestimonialSection } from '../components/TestimonialSection'
import { WhatYouKeepSection } from '../components/WhatYouKeepSection'

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
            <HeroSection />
            <ProofStrip />
            <WhatYouKeepSection />
            <HowItWorksSection />
            <TestimonialSection />
            <PricingSection />
            <FaqSection />
            <FinalCtaSection />
          </main>
          <LandingFooter />
        </div>
      </LandingExitProvider>
    </MotionProvider>
  )
}
