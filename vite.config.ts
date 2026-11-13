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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY

  return {
    plugins: [react(), enquiryDevApi()],
  }
})

