export type TripType = 'one-way' | 'airport' | 'hourly'
export type VehicleId = 'e-class' | 'v-class' | 'range-rover' | 's-class' | '5-series'

export interface Vehicle {
  id: VehicleId
  name: string
  shortName: string
  hourly: number
  seats: string
  image: string
}

export interface AirportFare {
  id: string
  name: string
  prices: Partial<Record<VehicleId, number>>
}

export const vehicles: Vehicle[] = [
  {
    id: 'e-class',
    name: 'Mercedes-Benz E-Class',
    shortName: 'E-Class',
    hourly: 50,
    seats: 'Up to 3 passengers',
    image: '/images/e-class-night.jpg',
  },
  {
    id: 'v-class',
    name: 'Mercedes-Benz V-Class',
    shortName: 'V-Class',
    hourly: 70,
    seats: 'Up to 6 passengers',
    image: '/images/v-class-night.jpg',
  },
  {
    id: 'range-rover',
    name: 'Land Rover Range Rover',
    shortName: 'Range Rover',
    hourly: 100,
    seats: 'Up to 4 passengers',
    image: '/images/rr-night.jpg',
  },
  {
    id: 's-class',
    name: 'Mercedes-Benz S-Class',
    shortName: 'S-Class',
    hourly: 75,
    seats: 'Up to 3 passengers',
    image: '/images/s-class-night.jpg',
  },
  {
    id: '5-series',
    name: 'BMW 5 Series',
    shortName: '5 Series',
    hourly: 50,
    seats: 'Up to 3 passengers',
    image: '/images/5-series-night.jpg',
  },
]

export const airports: AirportFare[] = [
  { id: 'lcy', name: 'London City', prices: { 'e-class': 65, 'v-class': 90, 'range-rover': 130 } },
  { id: 'lhr', name: 'Heathrow', prices: { 'e-class': 95, 'v-class': 135, 'range-rover': 190, 's-class': 150 } },
  { id: 'lgw', name: 'Gatwick', prices: { 'e-class': 130, 'v-class': 180, 'range-rover': 260, 's-class': 250 } },
  { id: 'ltn', name: 'Luton', prices: { 'e-class': 125, 'v-class': 175, 'range-rover': 250, 's-class': 250 } },
  { id: 'stn', name: 'Stansted', prices: { 'e-class': 145, 'v-class': 205, 'range-rover': 290, 's-class': 260 } },
  { id: 'fab', name: 'Farnborough', prices: { 'e-class': 140, 'v-class': 195, 'range-rover': 280 } },
]

export const minimumHours = 2

export const meterRates: Partial<Record<VehicleId, { perMinute: number; perMile: number }>> = {
  'e-class': { perMinute: 1, perMile: 1.6 },
  'v-class': { perMinute: 1.4, perMile: 2.2 },
  'range-rover': { perMinute: 2, perMile: 3.2 },
  's-class': { perMinute: 1.5, perMile: 2.4 },
  '5-series': { perMinute: 1, perMile: 1.6 },
}

export const formatPrice = (amount: number) => {
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? `£${rounded}` : `£${rounded.toFixed(2)}`
}

export type PriceCatalog = {
  vehicles?: Vehicle[]
  airports?: AirportFare[]
  minimumHours?: number
}

export function airportById(id: string, list: AirportFare[] = airports) {
  return list.find((airport) => airport.id === id)
}

const vehicleBrands: Record<VehicleId, string> = {
  'e-class': 'Mercedes-Benz',
  'v-class': 'Mercedes-Benz',
  'range-rover': 'Land Rover',
  's-class': 'Mercedes-Benz',
  '5-series': 'BMW',
}

export function vehicleTitle(vehicle: { id: VehicleId; name: string; shortName: string }) {
  const brand = vehicleBrands[vehicle.id]
  const model = vehicle.shortName.trim() || vehicle.name.trim()
  if (!brand || model.toLowerCase().startsWith(brand.toLowerCase())) return model || vehicle.name
  return `${brand} ${model}`
}

export function vehicleById(id: VehicleId, list: Vehicle[] = vehicles) {
  return list.find((vehicle) => vehicle.id === id)
}

export function matchAirport(text: string, list: AirportFare[] = airports) {
  const value = text.toLowerCase()
  return list.find(
    (airport) => value.includes(airport.name.toLowerCase()) || value.includes(airport.id),
  )
}

export function journeyPrice(options: {
  tripType: TripType
  vehicleId: VehicleId
  hours: number
  airportId: string
  pickup: string
  dropoff: string
  returning: boolean
  chargedHours?: number
  miles?: number
  minutes?: number
}, catalog: PriceCatalog = {}) {
  const vehicleList = catalog.vehicles ?? vehicles
  const airportList = catalog.airports ?? airports
  const minimum = catalog.minimumHours && catalog.minimumHours > 0 ? catalog.minimumHours : minimumHours
  const vehicle = vehicleById(options.vehicleId, vehicleList)
  if (!vehicle) return null

  if (options.tripType === 'hourly') {
    if (!vehicle.hourly) {
      return { amount: null, summary: `The ${vehicle.shortName} hourly fare is confirmed when you enquire.` }
    }
    const hours = Math.max(options.hours || minimum, minimum)
    const amount = vehicle.hourly * hours * (options.returning ? 2 : 1)
    return {
      amount,
      summary: `${formatPrice(vehicle.hourly)} per hour × ${hours} hour${hours === 1 ? '' : 's'}${options.returning ? ', including the return hire' : ''}`,
    }
  }

  const airport =
    options.tripType === 'airport'
      ? airportById(options.airportId, airportList)
      : matchAirport(`${options.pickup} ${options.dropoff}`, airportList)

  const meter = meterRates[options.vehicleId]
  const miles = options.miles
  const minutes = options.minutes
  const canMeter = Boolean(meter && miles != null && minutes != null && miles >= 0 && minutes > 0)

  if (airport) {
    const fare = airport.prices[options.vehicleId]
    if (fare != null) {
      const amount = options.returning ? fare * 2 : fare
      return {
        amount,
        summary: `${airport.name} fixed fare${options.returning ? ', including the return journey' : ''}`,
      }
    }
    if (!canMeter) {
      return {
        amount: null,
        summary: `${airport.name} in a ${vehicle.shortName} is confirmed when you enquire.`,
      }
    }
  }

  if (meter && miles != null && minutes != null && miles >= 0 && minutes > 0) {
    const oneWay = Math.round((minutes * meter.perMinute + miles * meter.perMile) * 100) / 100
    const amount = options.returning ? Math.round(oneWay * 2 * 100) / 100 : oneWay
    return {
      amount,
      summary: `${minutes} min × ${formatPrice(meter.perMinute)} + ${miles} mi × ${formatPrice(meter.perMile)}${options.returning ? ', including the return' : ''}`,
    }
  }

  if (!vehicle.hourly) {
    return { amount: null, summary: `The ${vehicle.shortName} fare is confirmed when you enquire.` }
  }

  const hours =
    options.chargedHours && options.chargedHours > 0
      ? Math.max(options.chargedHours, minimum)
      : minimum
  const amount = vehicle.hourly * hours * (options.returning ? 2 : 1)
  return {
    amount,
    summary:
      options.chargedHours && options.chargedHours > 0
        ? `${formatPrice(vehicle.hourly)} per hour × ${hours} hour${hours === 1 ? '' : 's'}${options.returning ? ', including the return' : ''}`
        : `From ${formatPrice(vehicle.hourly)} per hour, ${hours}-hour minimum${options.returning ? ', including the return' : ''}. The final fare is confirmed against the route.`,
  }
}
