import React from 'react'
import { vi, type Mock } from 'vitest'

// Shared @/i18n/navigation mock, applied globally for the 'unit' vitest project in setup.ts.
// Import `mockPush` etc. in individual tests to assert on navigation calls.

export const mockPush: Mock = vi.fn()
export const mockReplace: Mock = vi.fn()

interface MockRouter {
  push: Mock
  replace: Mock
  back: Mock
  forward: Mock
  prefetch: Mock
  refresh: Mock
}

export const mockRouter: MockRouter = {
  push: mockPush,
  replace: mockReplace,
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  refresh: vi.fn(),
}

export const useRouter = (): MockRouter => mockRouter
export const usePathname: Mock = vi.fn(() => '/en')

export function Link({
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { href: string }) {
  return React.createElement('a', { href, ...props }, children)
}
