import type { IncomingMessage, ServerResponse } from 'node:http'

export function json(body: unknown, status = 200, headers?: Record<string, string>) {
  const next = new Headers(headers)
  next.set('Content-Type', 'application/json')
  next.set('Cache-Control', 'no-store')
  return new Response(JSON.stringify(body), { status, headers: next })
}

export async function toRequest(req: IncomingMessage) {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue
    if (key === 'transfer-encoding' || key === 'content-length') continue
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item))
    else headers.set(key, value)
  }

  const url = `https://lunrlondon.local${req.url ?? '/'}`
  if (req.method === 'GET' || req.method === 'HEAD') {
    return new Request(url, { method: req.method, headers })
  }

  let body: Buffer | string | undefined
  const parsed = (req as IncomingMessage & { body?: unknown }).body
  if (parsed != null && (typeof parsed === 'string' || (typeof parsed === 'object' && !Buffer.isBuffer(parsed)))) {
    body = typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
    if (!headers.has('content-type')) headers.set('content-type', 'application/json')
  } else {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const raw = Buffer.concat(chunks)
    if (raw.byteLength) body = raw
  }

  return new Request(url, { method: req.method ?? 'POST', headers, body })
}

export async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  const cookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : []
  if (cookies.length) res.setHeader('Set-Cookie', cookies)
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie' || key === 'content-encoding') return
    res.setHeader(key, value)
  })
  res.end(Buffer.from(await response.arrayBuffer()))
}
