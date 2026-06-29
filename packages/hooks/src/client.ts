type ApiResponse<T> = { data: T }

interface FetchOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function fetchApi<T>(
  path: string,
  options: FetchOptions = {},
  getToken: () => Promise<string | null>,
  baseUrl: string,
): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  const json: ApiResponse<T> = await res.json()
  return json.data
}
