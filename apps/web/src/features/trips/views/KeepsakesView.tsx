import { FadeIn } from '@/components/motion/FadeIn'
import { KeepsakesCardsDataWrapper } from '../components/keepsakes/KeepsakesCardsDataWrapper'
import { KeepsakesHeaderDataWrapper } from '../components/keepsakes/KeepsakesHeaderDataWrapper'

interface Props {
  tripId: string
}

export function KeepsakesView({ tripId }: Props) {
  return (
    <div className="container mx-auto flex w-full flex-col gap-9 px-4 py-8">
      <FadeIn>
        <KeepsakesHeaderDataWrapper tripId={tripId} />
      </FadeIn>
      <KeepsakesCardsDataWrapper tripId={tripId} />
    </div>
  )
}
