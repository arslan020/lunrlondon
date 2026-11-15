import type { IncomingMessage, ServerResponse } from 'node:http'
import { clearSessionCookie } from '../auth.ts'
import { json, send } from '../http.ts'

export function POST() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    await send(res, json({ error: 'Method not allowed' }, 405))
    return
  }
  await send(res, POST())
}
