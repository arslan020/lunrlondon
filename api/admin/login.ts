import type { IncomingMessage, ServerResponse } from 'node:http'
import { checkCredentials, createSessionToken, sessionCookie } from '../auth.ts'
import { json, send, toRequest } from '../http.ts'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!checkCredentials(username, password)) return json({ error: 'Wrong username or password.' }, 401)
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(createSessionToken()) })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    await send(res, json({ error: 'Method not allowed' }, 405))
    return
  }
  await send(res, await POST(await toRequest(req)))
}
