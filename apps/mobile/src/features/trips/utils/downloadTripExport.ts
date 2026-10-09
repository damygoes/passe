import { fetch } from 'expo/fetch'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import { haptics } from '@/lib/haptics'

interface DownloadTripExportOptions {
  /** API path, e.g. `/api/trips/<id>/zine` */
  path: string
  method?: 'GET' | 'POST'
  body?: unknown
  /** Used when the server sends no Content-Disposition filename */
  fallbackFilename: string
  baseUrl: string
  getToken: () => Promise<string | null>
}

export class ShareUnavailableError extends Error {
  constructor() {
    super('Sharing is not available on this device')
    this.name = 'ShareUnavailableError'
  }
}

// The export routes answer 403 when the user's plan doesn't include the
// keepsake. Callers need to tell that apart from a genuine failure so they can
// show the upgrade path instead of "please try again" — and the server's own
// message is English-only, so it is never surfaced as UI copy.
export class PlanGateError extends Error {
  constructor() {
    super('This export requires a higher plan')
    this.name = 'PlanGateError'
  }
}

function extractFilename(contentDisposition: string | null, fallback: string): string {
  const match = contentDisposition ? /filename="([^"]+)"/.exec(contentDisposition) : null
  return match?.[1] ?? fallback
}

// Fetches a server-rendered PDF export and hands it to the native share sheet.
// Uses expo/fetch (WinterCG) rather than React Native's global fetch, whose
// arrayBuffer() support for binary bodies is unreliable.
export async function downloadTripExport({
  path,
  method = 'GET',
  body,
  fallbackFilename,
  baseUrl,
  getToken,
}: DownloadTripExportOptions): Promise<void> {
  try {
    if (!(await Sharing.isAvailableAsync())) throw new ShareUnavailableError()

    const token = await getToken()
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (res.status === 403) throw new PlanGateError()

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }

    const filename = extractFilename(res.headers.get('Content-Disposition'), fallbackFilename)
    const file = new File(Paths.cache, filename)
    if (file.exists) file.delete()
    file.write(new Uint8Array(await res.arrayBuffer()))

    haptics.success()
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    })
  } catch (err) {
    haptics.error()
    throw err
  }
}
