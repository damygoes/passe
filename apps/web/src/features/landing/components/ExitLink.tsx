'use client'

import { Link } from '@/i18n/navigation'
import type { ComponentProps, MouseEvent } from 'react'
import { useLandingExit } from './LandingExitProvider'

type ExitLinkProps = ComponentProps<typeof Link>

export function ExitLink({ href, onClick, ...props }: ExitLinkProps) {
  const { requestExit } = useLandingExit()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    requestExit(typeof href === 'string' ? href : String(href))
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
