import React from 'react'
import { Text } from 'react-native'

// Shared expo-router mock, registered globally in jest.setup.js. Import `mockPush` etc. in
// individual tests to assert on navigation calls, and `mockSearchParams` to control
// useLocalSearchParams()'s return value per test.

export const mockPush = jest.fn()
export const mockReplace = jest.fn()
export const mockBack = jest.fn()
export const mockRouterObject = {
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
}

export const useRouter = () => mockRouterObject
export const router = mockRouterObject

export let mockSearchParams: Record<string, string> = {}
export function setMockSearchParams(params: Record<string, string>) {
  mockSearchParams = params
}
export const useLocalSearchParams = () => mockSearchParams
export const usePathname = jest.fn(() => '/')

export function Link({
  children,
  href,
  ...props
}: { children: React.ReactNode; href: string } & Record<string, unknown>) {
  return (
    <Text accessibilityRole="link" onPress={() => mockPush(href)} {...props}>
      {children}
    </Text>
  )
}
