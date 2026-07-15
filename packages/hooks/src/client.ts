import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'hooks/fetchApi' } })

type ApiResponse<T> = { data: T }

interface FetchOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export async function fetchApi<T>(
  path: string,
  options: FetchOptions = {},
  getToken: () => Promise<string | null>,
  baseUrl: string,
): Promise<T> {
  const token = await getToken()

  log.debug(`${options.method ?? 'GET'} ${path}`)

  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    const message = (err as { error?: string }).error ?? `HTTP ${res.status}`
    log.error(`${options.method ?? 'GET'} ${path} failed`, {
      status: res.status,
      message,
    })
    throw new Error(message)
  }

  const json: ApiResponse<T> = await res.json()
  return json.data
}
