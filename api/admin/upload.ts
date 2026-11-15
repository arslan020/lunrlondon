import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { put } from '@vercel/blob'
import { hasSession } from '../auth.ts'
import { json, send, toRequest } from '../http.ts'
import { blobToken } from '../store.ts'

const MAX_BYTES = 80 * 1024 * 1024
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
])

function extension(type: string, name: string) {
  const fromName = path.extname(name).toLowerCase()
  if (fromName && fromName.length < 8) return fromName
  if (type === 'image/png') return '.png'
  if (type === 'image/webp') return '.webp'
  if (type === 'image/gif') return '.gif'
  if (type === 'video/webm') return '.webm'
  if (type === 'video/quicktime') return '.mov'
  if (type.startsWith('video/')) return '.mp4'
  return '.jpg'
}

function uploadMode() {
  if (blobToken()) return 'client'
  if (process.env.VERCEL === '1') return 'server'
  return 'local'
}

export async function GET(request: Request) {
  if (!hasSession(request)) return json({ error: 'Unauthorized' }, 401)
  const mode = uploadMode()
  return json({ mode, blob: mode !== 'local' })
}

export async function POST(request: Request) {
  if (!hasSession(request)) return json({ error: 'Unauthorized' }, 401)

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return json({ error: 'Choose a photo or video.' }, 400)
  if (file.type && !ALLOWED.has(file.type)) return json({ error: 'Use a JPG, PNG, WEBP, GIF, MP4, WEBM or MOV file.' }, 400)
  if (file.size > MAX_BYTES) return json({ error: 'Keep the file under 80MB.' }, 413)

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension(file.type, file.name)}`

  if (process.env.VERCEL === '1') {
    if (file.size > 4_500_000 && !blobToken()) {
      return json({ error: 'That file is too large for this upload. Use a photo under 4MB, or a shorter video.' }, 413)
    }
    try {
      const token = blobToken()
      const blob = await put(`uploads/${safeName}`, Buffer.from(await file.arrayBuffer()), {
        access: 'public',
        addRandomSuffix: true,
        ...(token ? { token } : {}),
      })
      return json({ url: blob.url })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.'
      return json({ error: message }, 500)
    }
  }

  const dir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()))
  return json({ url: `/uploads/${safeName}` })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const request = await toRequest(req)
  if (req.method === 'GET') {
    await send(res, await GET(request))
    return
  }
  if (req.method === 'POST') {
    await send(res, await POST(request))
    return
  }
  await send(res, json({ error: 'Method not allowed' }, 405))
}
