import { createHmac, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = 'lunr_admin'
const SESSION_SECONDS = 60 * 60 * 8
const SECRET = 'lunr-london-admin-session-v1'

export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = '123321'

function sign(value: string) {
  return createHmac('sha256', SECRET).update(value).digest('base64url')
}

function same(given: string, expected: string) {
  const left = Buffer.from(given)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function checkCredentials(username: string, password: string) {
  return same(username.trim().toLowerCase(), ADMIN_USERNAME) && same(password, ADMIN_PASSWORD)
}

export function createSessionToken() {
  const encoded = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_SECONDS * 1000 })).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return false
  const expected = sign(encoded)
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as { exp?: unknown }
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function readCookie(header: string | null, name: string) {
  if (!header) return ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

export function hasSession(request: Request) {
  return verifySessionToken(readCookie(request.headers.get('cookie'), SESSION_COOKIE))
}

function secureFlag() {
  return process.env.VERCEL === '1' ? '; Secure' : ''
}

export function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_SECONDS}; SameSite=Lax${secureFlag()}`
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag()}`
}
