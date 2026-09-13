import { FadeIn } from '@/components/motion/FadeIn'
import { StatsGridDataWrapper } from '../components/stats/StatsGridDataWrapper'

export function StatsView() {
  return (
    <div className="container mx-auto w-full px-4 py-8">
      <FadeIn>
        <StatsGridDataWrapper />
      </FadeIn>
    </div>
  )
}
