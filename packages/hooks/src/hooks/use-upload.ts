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

function isNativeUploadFile(file: UploadFile): file is NativeUploadFile {
  return !(file instanceof Blob)
}

// Expo's fetch/FormData implementation only accepts a real Blob or an object
// exposing `.bytes()` — React Native's classic { uri, name, type } file
// descriptor throws "Unsupported FormDataPart implementation". Response.blob()
// can't be used to build one either: Expo's own blob() constructs a
// React Native Blob from raw ArrayBuffer data, which RN's Blob explicitly
// rejects ("Creating blobs from 'ArrayBuffer' ... are not supported"). Reading
// the bytes directly and wrapping them in a `.bytes()`-shaped part sidesteps
// both native-only failure modes.
interface BytesFormDataPart {
  bytes(): Promise<Uint8Array>
  name: string
  type: string
}

async function toBytesPart(file: NativeUploadFile): Promise<BytesFormDataPart> {
  const response = await fetch(file.uri)
  return { bytes: () => response.bytes(), name: file.name, type: file.type }
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
      if (isNativeUploadFile(file)) {
        form.append('file', (await toBytesPart(file)) as unknown as Blob)
      } else {
        form.append('file', file)
      }
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
