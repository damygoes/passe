import * as FileSystem from 'expo-file-system'

// PUTs a local file's raw bytes to a presigned S3 URL — the transport half
// of useUploadImage()'s { contentType, put } contract (see @passe/hooks).
// BINARY_CONTENT sends the file as-is, no multipart envelope, matching the
// presigned PUT (not POST) the server mints.
export async function uploadFileToUrl(
  uploadUrl: string,
  uri: string,
  contentType: string,
): Promise<void> {
  const file = new FileSystem.File(uri)
  const result = await file.upload(uploadUrl, {
    httpMethod: 'PUT',
    uploadType: FileSystem.UploadType.BINARY_CONTENT,
    headers: { 'Content-Type': contentType },
  })
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Upload failed (HTTP ${result.status})`)
  }
}
