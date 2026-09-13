import { FadeIn } from '@/components/motion/FadeIn'
import { KeepsakesDataWrapper } from '../components/keepsakes/KeepsakesDataWrapper'

interface Props {
  tripId: string
}

export function KeepsakesView({ tripId }: Props) {
  return (
    <div className="container mx-auto w-full px-4 py-8">
      <FadeIn>
        <KeepsakesDataWrapper tripId={tripId} />
      </FadeIn>
    </div>
  )
}
