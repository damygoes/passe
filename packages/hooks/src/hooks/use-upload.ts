import { useMutation } from '@tanstack/react-query'
import { usePasseApi } from '../context'

interface UploadSignature {
  key: string
  uploadUrl: string
}

export interface UploadedKey {
  key: string
}

export interface UploadInput {
  contentType: string
  // Platform-specific PUT to the presigned URL — web supplies a fetch() PUT
  // of a Blob, mobile supplies expo-file-system's FileSystem.uploadAsync().
  // The shared hook only orchestrates sign → put → key; it never imports a
  // DOM or React Native transport API directly, so it stays safe to use from
  // both apps/web and apps/mobile.
  put: (uploadUrl: string) => Promise<void>
}

// Uploads a file directly from the client to S3 using a presigned PUT URL
// minted by POST /api/uploads/sign. Image bytes never pass through the
// Passé API. Returns the S3 object key — not a renderable URL, since every
// read of private media goes through a signed /api/media/... URL minted
// server-side per request (see apps/web/src/lib/media.ts).
export function useUploadImage() {
  const { fetchApi } = usePasseApi()

  return useMutation({
    mutationFn: async ({ contentType, put }: UploadInput): Promise<UploadedKey> => {
      const sig = await fetchApi<UploadSignature>('/api/uploads/sign', {
        method: 'POST',
        body: { contentType },
      })

      await put(sig.uploadUrl)

      return { key: sig.key }
    },
  })
}
