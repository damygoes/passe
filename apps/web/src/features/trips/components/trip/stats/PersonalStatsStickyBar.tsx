'use client'

import { snappySpring } from '@/lib/motion'
import { AnimatePresence, m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  /** The stats cards grid — the bar shows once this scrolls above the viewport */
  sentinelRef: RefObject<HTMLElement | null>
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

/**
 * Compact sticky recap of the account-wide stats for small viewports. Slides
 * in under the navbar once the stat cards scroll out of view. Rendered
 * through a portal because ancestors animated by FadeIn keep a `filter`
 * style, which creates a containing block that would trap `position: fixed`.
 */
export function PersonalStatsStickyBar({
  sentinelRef,
  countriesCount,
  citiesCount,
  yearsCount,
}: Props) {
  const t = useTranslations('trips.stats')
  const [scrolledPast, setScrolledPast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      // Only when the grid left through the top — not when it's below the fold
      setScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [sentinelRef])

  if (!mounted) return null

  const recap = [
    `${countriesCount} ${t('countries', { count: countriesCount })}`,
    `${citiesCount} ${t('cities', { count: citiesCount })}`,
    `${yearsCount} ${t('years', { count: yearsCount })}`,
  ].join(' · ')

  return createPortal(
    <AnimatePresence>
      {scrolledPast && (
        <m.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={snappySpring}
          className="fixed inset-x-0 top-16 z-40 border-b bg-background/90 px-4 py-2 backdrop-blur-sm md:hidden"
        >
          <p className="text-center text-sm font-medium">{recap}</p>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
