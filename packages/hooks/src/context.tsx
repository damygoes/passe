import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { fetchApi as baseFetchApi } from './client'

interface FetchOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export interface PasseApiContextValue {
  fetchApi: <T>(path: string, options?: FetchOptions) => Promise<T>
  /** Raw transport details for callers that need non-JSON responses (e.g. PDF downloads) */
  baseUrl: string
  getToken: () => Promise<string | null>
}

const PasseApiContext = createContext<PasseApiContextValue | null>(null)

interface PasseApiProviderProps {
  children: ReactNode
  getToken: () => Promise<string | null>
  baseUrl: string
}

export function PasseApiProvider({ children, getToken, baseUrl }: PasseApiProviderProps) {
  const value = useMemo<PasseApiContextValue>(
    () => ({
      fetchApi: <T,>(path: string, options: FetchOptions = {}) =>
        baseFetchApi<T>(path, options, getToken, baseUrl),
      baseUrl,
      getToken,
    }),
    [getToken, baseUrl],
  )

  return <PasseApiContext.Provider value={value}>{children}</PasseApiContext.Provider>
}

export function usePasseApi(): PasseApiContextValue {
  const ctx = useContext(PasseApiContext)
  if (!ctx) throw new Error('usePasseApi must be used within PasseApiProvider')
  return ctx
}
