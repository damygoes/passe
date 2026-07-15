'use client'

import { PasseApiProvider } from '@passe/hooks/context'
import { useAuth } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function ApiProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60, refetchOnWindowFocus: 'always' } },
      }),
  )
  const { getToken } = useAuth()

  return (
    <QueryClientProvider client={queryClient}>
      <PasseApiProvider getToken={getToken} baseUrl="">
        {children}
      </PasseApiProvider>
    </QueryClientProvider>
  )
}
