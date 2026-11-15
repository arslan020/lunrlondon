import { setDefaultResultOrder } from 'node:dns'

setDefaultResultOrder('ipv4first')

const minimumHours = 2

type HandlerRequest = {
  method?: string
  body?: unknown
}

type HandlerResponse = {
  status: (code: number) => HandlerResponse
  json: (body: unknown) => void
}

type Suggestion = {
  placeId: string
  main: string
  secondary: string
  label: string
}

function text(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001F]/g, '').trim().slice(0, max)
}

function placeId(value: unknown) {
  const id = text(value, 300)
  return /^[A-Za-z0-9_-]{8,}$/.test(id) ? id : ''
}

function londonDeparture(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  if (!year || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null

  const target = Date.UTC(year, month - 1, day, hour, minute)
  let utc = target
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = Object.fromEntries(format.formatToParts(new Date(utc)).map((part) => [part.type, part.value]))
    let shownHour = Number(parts.hour)
    let shownDay = Number(parts.day)
    if (shownHour === 24) shownHour = 0
    const shown = Date.UTC(Number(parts.year), Number(parts.month) - 1, shownDay, shownHour, Number(parts.minute))
    const delta = target - shown
    if (delta === 0) break
    utc += delta
  }

  const when = new Date(utc)
  return Number.isNaN(when.getTime()) ? null : when
}

function seconds(value: unknown) {
  if (typeof value !== 'string') return 0
  const match = /^(\d+(?:\.\d+)?)s$/.exec(value)
  return match ? Number(match[1]) : 0
}

async function suggest(input: string, sessionToken: string, apiKey: string) {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      input,
      sessionToken,
      languageCode: 'en',
      includedRegionCodes: ['gb'],
      locationBias: {
        circle: {
          center: { latitude: 51.5074, longitude: -0.1278 },
          radius: 50000,
        },
      },
    }),
  })

  if (!response.ok) {
    console.error('Places autocomplete failed', response.status)
    return { status: 502, body: { error: 'Address search is unavailable just now.' } }
  }

  const payload = (await response.json()) as {
    suggestions?: {
      placePrediction?: {
        placeId?: string
        text?: { text?: string }
        structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } }
      }
    }[]
  }

  const suggestions: Suggestion[] = []
  for (const item of payload.suggestions ?? []) {
    const prediction = item.placePrediction
    const id = placeId(prediction?.placeId)
    const label = text(prediction?.text?.text, 200)
    if (!id || !label) continue
    suggestions.push({
      placeId: id,
      label,
      main: text(prediction?.structuredFormat?.mainText?.text, 120) || label,
      secondary: text(prediction?.structuredFormat?.secondaryText?.text, 160),
    })
    if (suggestions.length === 5) break
  }

  return { status: 200, body: { suggestions } }
}

function waypoint(id: string, address: string) {
  if (id) return { placeId: id }
  if (address.length >= 3) return { address }
  return null
}

async function route(input: {
  originPlaceId: string
  originAddress: string
  destinationPlaceId: string
  destinationAddress: string
  date: string
  time: string
  apiKey: string
}) {
  const origin = waypoint(input.originPlaceId, input.originAddress)
  const destination = waypoint(input.destinationPlaceId, input.destinationAddress)
  if (!origin || !destination) {
    return { status: 400, body: { error: 'Choose a pickup and a drop-off from the address list.' } }
  }

  const departure = londonDeparture(input.date, input.time)
  const useTraffic = Boolean(departure && departure.getTime() > Date.now() + 60_000)
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': input.apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
    },
    body: JSON.stringify({
      origin,
      destination,
      travelMode: 'DRIVE',
      routingPreference: useTraffic ? 'TRAFFIC_AWARE' : 'TRAFFIC_UNAWARE',
      ...(useTraffic && departure ? { departureTime: departure.toISOString() } : {}),
    }),
  })

  if (!response.ok) {
    console.error('Routes request failed', response.status)
    return { status: 502, body: { error: 'The route could not be calculated just now.' } }
  }

  const payload = (await response.json()) as {
    routes?: { duration?: string; distanceMeters?: number }[]
  }
  const found = payload.routes?.[0]
  const duration = seconds(found?.duration)
  const meters = typeof found?.distanceMeters === 'number' ? found.distanceMeters : 0
  if (!found || duration <= 0 || meters <= 0) {
    return { status: 422, body: { error: 'No driving route was found for those addresses.' } }
  }

  const driveHours = duration / 3600
  return {
    status: 200,
    body: {
      miles: Math.round((meters / 1609.344) * 10) / 10,
      minutes: Math.max(1, Math.round(duration / 60)),
      billedHours: Math.max(minimumHours, Math.ceil(driveHours - 1e-9)),
      traffic: useTraffic,
    },
  }
}

export async function deliverQuote(input: unknown) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return { status: 500, body: { error: 'Address search is not configured.' } }

  const body = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {}
  const action = text(body.action, 20)

  if (action === 'suggest') {
    const query = text(body.input, 120)
    const sessionToken = text(body.sessionToken, 80)
    if (query.length < 2 || sessionToken.length < 8) return { status: 200, body: { suggestions: [] } }
    return suggest(query, sessionToken, apiKey)
  }

  if (action === 'route') {
    const originPlaceId = placeId(body.originPlaceId)
    const destinationPlaceId = placeId(body.destinationPlaceId)
    if (originPlaceId && destinationPlaceId && originPlaceId === destinationPlaceId) {
      return { status: 400, body: { error: 'Choose a pickup and a drop-off from the address list.' } }
    }
    return route({
      originPlaceId,
      originAddress: text(body.originAddress, 200),
      destinationPlaceId,
      destinationAddress: text(body.destinationAddress, 200),
      date: text(body.date, 10),
      time: text(body.time, 5),
      apiKey,
    })
  }

  return { status: 400, body: { error: 'Invalid request.' } }
}

export default async function handler(req: HandlerRequest, res: HandlerResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? (JSON.parse(req.body) as unknown) : req.body
    const result = await deliverQuote(body)
    res.status(result.status).json(result.body)
  } catch {
    res.status(400).json({ error: 'Invalid request.' })
  }
}
