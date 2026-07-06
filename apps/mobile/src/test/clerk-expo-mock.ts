// Shared @clerk/expo (+ @clerk/expo/legacy) mock, registered globally in jest.setup.js.
// Mirrors apps/web/src/test/clerk-mock.ts's shape so the two apps' auth flows test the same way.

const resolved = (value: unknown) => jest.fn(() => Promise.resolve(value))

export const mockSignIn = {
  create: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  prepareSecondFactor: resolved({}),
  attemptSecondFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  attemptFirstFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
}

export const mockSignUp = {
  create: resolved({}),
  prepareEmailAddressVerification: resolved({}),
  attemptEmailAddressVerification: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
}

export const mockSetActive = jest.fn()
export const mockSignOut = jest.fn()
export const mockStartSSOFlow = resolved({ createdSessionId: null, setActive: null })

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

export const useSignIn = () => ({ signIn: mockSignIn, setActive: mockSetActive, isLoaded: true })
export const useSignUp = () => ({ signUp: mockSignUp, setActive: mockSetActive, isLoaded: true })
export const useClerk = () => ({ signOut: mockSignOut })
export const useAuth = () => ({
  getToken: resolved('mock-token'),
  userId: 'user_mock',
  isLoaded: true,
  isSignedIn: true,
})
export const useUser = () => ({ user: mockUser, isLoaded: true, isSignedIn: true })
export const useSession = () => ({ session: mockSession })
export const useSSO = () => ({ startSSOFlow: mockStartSSOFlow })
export const isClerkAPIResponseError = jest.fn(() => false)
