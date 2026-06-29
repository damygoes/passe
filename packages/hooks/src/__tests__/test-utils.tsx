import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { PasseApiProvider } from '../context'

export const BASE_URL = 'http://localhost'

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <PasseApiProvider getToken={async () => 'test-token'} baseUrl={BASE_URL}>
          {children}
        </PasseApiProvider>
      </QueryClientProvider>
    )
  }
}

export function mockFetchSuccess(data: unknown) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data }),
  } as Response)
}

export function mockFetchError(status: number, error: string) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: error,
    json: async () => ({ error }),
  } as Response)
}
