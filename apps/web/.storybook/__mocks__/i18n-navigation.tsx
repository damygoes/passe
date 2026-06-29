import React, { type ComponentPropsWithoutRef } from 'react'

const noop = () => {}

export const useRouter = () => ({
  push: noop,
  replace: noop,
  back: noop,
  forward: noop,
  prefetch: noop,
  refresh: noop,
})

export const usePathname = () => '/en'

export function Link({ children, href, ...props }: ComponentPropsWithoutRef<'a'> & { href: string }) {
  return React.createElement('a', { href, ...props }, children)
}
