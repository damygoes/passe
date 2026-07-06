import { vi, type Mock } from 'vitest'

// Shared @clerk/nextjs mock — used by both Storybook (.storybook/__mocks__/clerk.ts re-exports
// this) and vitest unit tests (`vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))`)
// so the mock shape only needs to be maintained in one place.

const resolved = (value: unknown) => vi.fn(() => Promise.resolve(value))

export const mockSignIn = {
  create: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  prepareSecondFactor: resolved({}),
  attemptSecondFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  attemptFirstFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  authenticateWithRedirect: resolved({}),
}

export const mockSignUp = {
  create: resolved({}),
  prepareEmailAddressVerification: resolved({}),
  attemptEmailAddressVerification: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
}

export const mockSignOut: Mock = vi.fn()
export const mockSetActive: Mock = vi.fn()

export const mockSession = {
  startVerification: resolved({ supportedFirstFactors: [] }),
  prepareFirstFactorVerification: resolved({}),
  attemptFirstFactorVerification: resolved({ status: 'complete' }),
}

export const mockUser = {
  id: 'user_mock',
  fullName: 'Test User',
  primaryEmailAddress: { emailAddress: 'test@example.com' },
  updatePassword: resolved({}),
  reload: resolved(undefined),
}

export const useSignIn = (): {
  signIn: typeof mockSignIn
  setActive: Mock
  isLoaded: boolean
} => ({ signIn: mockSignIn, setActive: mockSetActive, isLoaded: true })
export const useSignUp = (): {
  signUp: typeof mockSignUp
  setActive: Mock
  isLoaded: boolean
} => ({ signUp: mockSignUp, setActive: mockSetActive, isLoaded: true })
export const useClerk = (): { signOut: Mock } => ({ signOut: mockSignOut })
export const useAuth = () => ({
  getToken: resolved('mock-token'),
  userId: 'user_mock',
  isLoaded: true,
  isSignedIn: true,
})
export const useUser = () => ({
  user: mockUser,
  isLoaded: true,
  isSignedIn: true,
})
export const useSession = () => ({ session: mockSession })
