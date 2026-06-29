const noop = () => {}
const resolved = (value: unknown) => () => Promise.resolve(value)

const mockSignIn = {
  create: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  prepareSecondFactor: resolved({}),
  attemptSecondFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  attemptFirstFactor: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
  authenticateWithRedirect: resolved({}),
}

const mockSignUp = {
  create: resolved({}),
  prepareEmailAddressVerification: resolved({}),
  attemptEmailAddressVerification: resolved({ status: 'complete', createdSessionId: 'sess_mock' }),
}

export const useSignIn = () => ({ signIn: mockSignIn, setActive: noop, isLoaded: true })
export const useSignUp = () => ({ signUp: mockSignUp, setActive: noop, isLoaded: true })
export const useClerk = () => ({ signOut: noop })
export const useAuth = () => ({
  getToken: resolved('mock-token'),
  userId: 'user_mock',
  isLoaded: true,
  isSignedIn: true,
})
export const useUser = () => ({
  user: { id: 'user_mock', fullName: 'Test User' },
  isLoaded: true,
  isSignedIn: true,
})
