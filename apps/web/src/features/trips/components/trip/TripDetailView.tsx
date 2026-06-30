'use client'

import { MemoriesList } from '../memories/MemoriesList'
import { TripDetailHeader } from './TripDetailHeader'

interface Props {
  id: string
}

export function TripDetailView({ id }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <TripDetailHeader id={id} />
      <MemoriesList tripId={id} />
    </div>
  )
}
