import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, vi } from 'vitest'

// Applied globally to the 'unit' vitest project — most client components call
// useTranslations and the locale-aware navigation helpers, so mocking them once here
// avoids repeating boilerplate in every test file. Tests needing real interpolation or
// specific pathname/router assertions can override via vi.mocked(...) per test.
vi.mock('next-intl', () => {
  const translate = Object.assign((key: string) => key, {
    rich: (key: string) => key,
  })
  return {
    useTranslations: () => translate,
    useLocale: () => 'en',
  }
})

vi.mock('@/i18n/navigation', () => import('@/test/navigation-mock'))

// next/image validates remote hostnames against next.config.js's remotePatterns via a runtime
// context that's only populated inside a real Next.js server/build — outside of it (as here)
// every remote src throws. Render a plain <img> instead; layout/loader behavior isn't under test.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props }
    delete imgProps.fill
    delete imgProps.sizes
    return React.createElement('img', imgProps)
  },
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
