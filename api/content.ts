import type { IncomingMessage, ServerResponse } from 'node:http'
import { json, send } from './http.ts'
import { readContent } from './store.ts'

export async function GET() {
  try {
    return json({ content: await readContent() })
  } catch (error) {
    console.error(error)
    return json({ content: null })
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    await send(res, json({ error: 'Method not allowed' }, 405))
    return
  }
  await send(res, await GET())
}
