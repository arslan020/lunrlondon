import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setDefaultResultOrder } from 'node:dns'
import { neon } from '@neondatabase/serverless'

setDefaultResultOrder('ipv4first')

const ROW_ID = 'default'
const FILE_PATH = path.join(process.cwd(), 'data', 'site-content.json')

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return ''
}

export function databaseUrl() {
  return readEnv(
    'DATABASE_URL',
    'POSTGRES_URL',
    'POSTGRES_PRISMA_URL',
    'NEON_DATABASE_URL',
    'DATABASE_URL_UNPOOLED',
    'POSTGRES_URL_NON_POOLING',
  )
}

export function blobToken() {
  const named = readEnv('BLOB_READ_WRITE_TOKEN', 'Blob_READ_WRITE_TOKEN')
  if (named) return named
  for (const [key, value] of Object.entries(process.env)) {
    if (!value) continue
    const trimmed = value.trim()
    if (trimmed.startsWith('vercel_blob_rw_')) return trimmed
    if (/BLOB/i.test(key) && /TOKEN/i.test(key) && trimmed.length > 20) return trimmed
  }
  return ''
}

function getSql() {
  const url = databaseUrl()
  if (!url) return null
  return neon(url, { fetchOptions: { cache: 'no-store' } })
}

type SqlClient = NonNullable<ReturnType<typeof getSql>>

function canUseFileStore() {
  return process.env.VERCEL !== '1'
}

export function isStorageConfigured() {
  return Boolean(databaseUrl()) || canUseFileStore()
}

async function ensureTable(sql: SqlClient) {
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown
    } catch {
      return null
    }
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value as Record<string, unknown>
  return null
}

async function readFileStore() {
  try {
    return asObject(await readFile(FILE_PATH, 'utf8'))
  } catch {
    return null
  }
}

async function readPublishedContent() {
  try {
    const response = await fetch('https://lunrlondon.co.uk/api/content', { cache: 'no-store' })
    if (!response.ok) return null
    const data = (await response.json()) as { content?: unknown }
    return asObject(data.content)
  } catch {
    return null
  }
}

export async function readContent() {
  const sql = getSql()
  if (sql) {
    await ensureTable(sql)
    const rows = (await sql`SELECT data FROM site_content WHERE id = ${ROW_ID} LIMIT 1`) as { data: unknown }[]
    return asObject(rows[0]?.data)
  }
  if (!canUseFileStore()) return null
  const published = await readPublishedContent()
  if (published) return published
  return readFileStore()
}

export async function writeContent(content: Record<string, unknown>) {
  const sql = getSql()
  const payload = JSON.stringify(content)
  if (sql) {
    await ensureTable(sql)
    await sql`
      INSERT INTO site_content (id, data, updated_at)
      VALUES (${ROW_ID}, ${payload}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `
    return
  }
  if (!canUseFileStore()) {
    throw new Error('Connect a Neon database in the Vercel Storage tab, then redeploy.')
  }
  await mkdir(path.dirname(FILE_PATH), { recursive: true })
  await writeFile(FILE_PATH, JSON.stringify(content, null, 2), 'utf8')
}
