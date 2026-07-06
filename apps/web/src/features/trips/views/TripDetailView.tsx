'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { MemoriesList } from '../components/memories/MemoriesList'
import { TripDetailHeader } from '../components/trip/TripDetailHeader'

interface Props {
  id: string
}

export function TripDetailView({ id }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <TripDetailHeader id={id} />
      </FadeIn>
      <FadeIn delay={SECTION_STEP}>
        <MemoriesList tripId={id} />
      </FadeIn>
    </div>
  )
}
