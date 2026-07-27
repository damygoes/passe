'use client'

import { useRef, type ReactNode } from 'react'
import { ScrollFlightPlane } from './ScrollFlightPlane'

export function FlightPathSpan({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="relative">
      {children}
      <ScrollFlightPlane containerRef={containerRef} />
    </div>
  )
}
