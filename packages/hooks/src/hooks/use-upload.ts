import { useMutation } from '@tanstack/react-query'
import { createLogger } from '@passe/logger'
import { usePasseApi } from '../context'

const log = createLogger({ context: { module: 'hooks/use-upload' } })

interface UploadSignature {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

// React Native FormData file descriptor — the web equivalent is a File/Blob
export interface NativeUploadFile {
  uri: string
  name: string
  type: string
}

export type UploadFile = Blob | NativeUploadFile

export interface UploadedImage {
  url: string
  width: number | null
  height: number | null
}

interface CloudinaryUploadResponse {
  secure_url: string
  width?: number
  height?: number
}

// Uploads an image directly from the client to Cloudinary using a
// short-lived signature issued by POST /api/uploads/sign. Image bytes never
// pass through the Passé API. Works on web (File/Blob) and React Native
// ({ uri, name, type }).
export function useUploadImage() {
  const { fetchApi } = usePasseApi()

  return useMutation({
    mutationFn: async (file: UploadFile): Promise<UploadedImage> => {
      const sig = await fetchApi<UploadSignature>('/api/uploads/sign', { method: 'POST' })

      const form = new FormData()
      // RN's FormData accepts { uri, name, type } but its types only declare Blob
      form.append('file', file as Blob)
      form.append('api_key', sig.apiKey)
      form.append('timestamp', String(sig.timestamp))
      form.append('signature', sig.signature)
      form.append('folder', sig.folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message =
          (body as { error?: { message?: string } } | null)?.error?.message ??
          `Upload failed (HTTP ${res.status})`
        log.error('Cloudinary upload failed', { status: res.status, message })
        throw new Error(message)
      }

      const json = (await res.json()) as CloudinaryUploadResponse
      return { url: json.secure_url, width: json.width ?? null, height: json.height ?? null }
    },
  })
}
