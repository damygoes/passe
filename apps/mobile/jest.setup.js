// @ts-check
require('react-native-gesture-handler/jestSetup')

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

afterEach(() => {
  jest.clearAllMocks()
})
