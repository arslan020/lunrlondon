import type { IncomingMessage, ServerResponse } from 'node:http'
import { hasSession } from '../auth.ts'
import { json, send, toRequest } from '../http.ts'
import { blobToken, isStorageConfigured, readContent, writeContent } from '../store.ts'

const MAX_BYTES = 1_500_000

export async function GET(request: Request) {
  if (!hasSession(request)) return json({ error: 'Unauthorized' }, 401)
  try {
    return json({
      content: await readContent(),
      storageConfigured: isStorageConfigured(),
      blob: Boolean(blobToken()) || process.env.VERCEL === '1',
    })
  } catch (error) {
    console.error(error)
    return json({ error: 'The saved content could not be loaded.' }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSession(request)) return json({ error: 'Unauthorized' }, 401)
  const raw = await request.text()
  if (raw.length > MAX_BYTES) return json({ error: 'That update is too large.' }, 413)
  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    return json({ error: 'Invalid content.' }, 400)
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return json({ error: 'Invalid content.' }, 400)
  }
  try {
    await writeContent(parsed as Record<string, unknown>)
    return json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save.'
    return json({ error: message }, 500)
  }
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
