'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { MapDataWrapper } from '../components/MapDataWrapper'

export function MapView() {
  return (
    <div className="container mx-auto w-full px-4 py-8">
      <FadeIn>
        <MapDataWrapper />
      </FadeIn>
    </div>
  )
}
