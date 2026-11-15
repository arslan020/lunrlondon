import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { hasSession } from '../auth.ts'
import { json, send, toRequest } from '../http.ts'
import { blobToken } from '../store.ts'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime']

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null
  if (!body || typeof body !== 'object' || !('type' in body)) return json({ error: 'Invalid upload.' }, 400)

  try {
    const token = blobToken()
    const result = await handleUpload({
      body,
      request,
      ...(token ? { token } : {}),
      onBeforeGenerateToken: async () => {
        if (!hasSession(request)) throw new Error('Unauthorized')
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.'
    const status = message === 'Unauthorized' ? 401 : 400
    return json({ error: status === 401 ? 'Unauthorized' : 'The file could not be uploaded.' }, status)
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    await send(res, json({ error: 'Method not allowed' }, 405))
    return
  }
  await send(res, await POST(await toRequest(req)))
}
