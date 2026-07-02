'use client'

import { useEffect, useRef, type ComponentProps, type CSSProperties } from 'react'

export interface RevealProps extends ComponentProps<'div'> {
  /** Direction the content travels from while revealing */
  direction?: 'up' | 'left' | 'right'
  /** Delay in ms before the reveal transition starts */
  delay?: number
}

/**
 * Reveals its children once they scroll into view. The hidden state lives in
 * globals.css behind prefers-reduced-motion and scripting media queries, so
 * content is always visible without JS or when the user opts out of motion.
 */
export function Reveal({ direction = 'up', delay = 0, style, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.setAttribute('data-visible', '')
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={direction}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}
