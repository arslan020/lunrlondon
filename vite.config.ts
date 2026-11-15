import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'

function readBody(req: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function enquiryDevApi(): Plugin {
  return {
    name: 'enquiry-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/enquiry') {
          next()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const raw = await readBody(req)
          if (raw.length > 20_000) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Message is too long.' }))
            return
          }
          const loaded = (await server.ssrLoadModule('/api/enquiry.ts')) as {
            deliverEnquiry: (input: unknown) => Promise<{ ok: boolean; status: number; error?: string }>
          }
          const result = await loaded.deliverEnquiry(JSON.parse(raw) as unknown)
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.ok ? { ok: true } : { error: result.error ?? 'Could not send' }))
        } catch (error) {
          console.error(error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Could not send' }))
        }
      })
    },
  }
}

function cmsDevApi(): Plugin {
  const routes: Record<string, string> = {
    '/api/content': '/api/content.ts',
    '/api/admin/login': '/api/admin/login.ts',
    '/api/admin/logout': '/api/admin/logout.ts',
    '/api/admin/content': '/api/admin/content.ts',
    '/api/admin/upload': '/api/admin/upload.ts',
    '/api/admin/blob': '/api/admin/blob.ts',
  }

  return {
    name: 'cms-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        const file = pathname ? routes[pathname] : undefined
        if (!file) {
          next()
          return
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          const raw = Buffer.concat(chunks)
          if (raw.byteLength > 80 * 1024 * 1024) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'That file is too large.' }))
            return
          }

          const headers = new Headers()
          if (req.headers.cookie) headers.set('cookie', req.headers.cookie)
          if (req.headers['content-type']) headers.set('content-type', String(req.headers['content-type']))
          const request = new Request(`http://localhost${pathname}`, {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' || raw.byteLength === 0 ? undefined : raw,
          })
          const loaded = (await server.ssrLoadModule(file)) as {
            GET?: (request: Request) => Promise<Response>
            POST?: (request: Request) => Promise<Response>
          }
          const method = req.method === 'GET' ? loaded.GET : req.method === 'POST' ? loaded.POST : undefined
          const response = method ? await method(request) : new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
          res.statusCode = response.status
          const cookies = response.headers.getSetCookie?.() ?? []
          if (cookies.length) res.setHeader('Set-Cookie', cookies)
          response.headers.forEach((value, key) => {
            if (key !== 'set-cookie') res.setHeader(key, value)
          })
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          console.error(error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'The dashboard could not complete that request.' }))
        }
      })
    },
  }
}

function quoteDevApi(): Plugin {
  return {
    name: 'quote-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/quote') {
          next()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const raw = await readBody(req)
          if (raw.length > 8_000) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Request is too long.' }))
            return
          }
          const loaded = (await server.ssrLoadModule('/api/quote.ts')) as {
            deliverQuote: (input: unknown) => Promise<{ status: number; body: unknown }>
          }
          const result = await loaded.deliverQuote(JSON.parse(raw) as unknown)
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch (error) {
          console.error(error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'The route could not be calculated just now.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const keys = [
    'RESEND_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'DATABASE_URL',
    'POSTGRES_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_URL_UNPOOLED',
    'NEON_DATABASE_URL',
    'BLOB_READ_WRITE_TOKEN',
  ]
  for (const key of keys) {
    if (env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), enquiryDevApi(), quoteDevApi(), cmsDevApi()],
  }
})

