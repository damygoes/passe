'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { ByPlaceListDataWrapper } from '../components/home/ByPlaceListDataWrapper'
import { ContinueTripCardDataWrapper } from '../components/home/ContinueTripCardDataWrapper'
import { HomeHeaderDataWrapper } from '../components/home/HomeHeaderDataWrapper'
import { ImportPromptCardDataWrapper } from '../components/home/ImportPromptCardDataWrapper'

export function DashboardView() {
  return (
    <div className="container mx-auto flex w-full flex-col gap-8 px-4 py-8">
      <FadeIn>
        <HomeHeaderDataWrapper />
      </FadeIn>
      <FadeIn delay={SECTION_STEP}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
          <ContinueTripCardDataWrapper />
          <div className="flex flex-col gap-5">
            <ByPlaceListDataWrapper />
            <ImportPromptCardDataWrapper />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
