// @ts-check
require('react-native-gesture-handler/jestSetup')

// CI runners are heavily CPU-contended when turbo runs lint/check-types/test/build
// concurrently (e.g. TripForm.test.tsx alone took 70s in CI vs <1s locally), so the
// default 5000ms per-test timeout spuriously fails otherwise-fast async tests.
jest.setTimeout(30000)

// Reanimated 4 (and even its own /mock export) pulls in the native worklets binding on
// require(), which doesn't exist under Jest's Node environment — use a hand-rolled JS-only
// mock instead. See src/test/reanimated-mock.js for details.
jest.mock('react-native-reanimated', () => require('./src/test/reanimated-mock'))

// Applied globally — most screens call useTranslations and Clerk/expo-router hooks, so
// mocking them once here avoids repeating boilerplate in every test file. Tests needing
// specific mock return values override via jest.mocked(...) per test.
jest.mock('@/i18n/useTranslations', () => ({
  useTranslations: () => (key) => key,
}))

jest.mock('@clerk/expo', () => require('./src/test/clerk-expo-mock'))
jest.mock('@clerk/expo/legacy', () => require('./src/test/clerk-expo-mock'))
jest.mock('expo-router', () => require('./src/test/expo-router-mock'))

// useSafeAreaInsets() throws without a <SafeAreaProvider> ancestor (unlike SafeAreaView, which
// degrades gracefully) — components like DropdownMenuContent that need raw inset values would
// otherwise require every consuming test to wrap in a provider. Other exports (SafeAreaView,
// SafeAreaProvider, etc.) keep their real implementation.
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

afterEach(() => {
  jest.clearAllMocks()
})
