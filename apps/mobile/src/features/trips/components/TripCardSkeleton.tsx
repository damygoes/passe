import { useMemo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function TripCardSkeleton() {
  const { borderRadius } = useTheme()

  const style = useMemo(
    () => ({ width: '100%' as const, aspectRatio: 4 / 3, borderRadius: borderRadius.xl }),
    [borderRadius],
  )

  return <Skeleton style={style} />
}
