export type TripType = 'one-way' | 'airport' | 'hourly'
export type VehicleId = 'e-class' | 'v-class' | 'range-rover' | 's-class'

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
    image: '/images/e-class.jpg',
  },
  {
    id: 'v-class',
    name: 'Mercedes-Benz V-Class',
    shortName: 'V-Class',
    hourly: 70,
    seats: 'Up to 6 passengers',
    image: '/images/v-class.jpg',
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    shortName: 'Range Rover',
    hourly: 100,
    seats: 'Up to 4 passengers',
    image: '/images/range-rover.jpg',
  },
  {
    id: 's-class',
    name: 'Mercedes-Benz S-Class',
    shortName: 'S-Class',
    hourly: 75,
    seats: 'Up to 3 passengers',
    image: '/images/s-class.jpg',
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

export const formatPrice = (amount: number) => `£${amount}`

export function airportById(id: string) {
  return airports.find((airport) => airport.id === id)
}

export function vehicleById(id: VehicleId) {
  return vehicles.find((vehicle) => vehicle.id === id)
}

export function matchAirport(text: string) {
  const value = text.toLowerCase()
  return airports.find(
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
}) {
  const vehicle = vehicleById(options.vehicleId)
  if (!vehicle) return null

  if (options.tripType === 'hourly') {
    const hours = Math.max(options.hours || minimumHours, minimumHours)
    const amount = vehicle.hourly * hours * (options.returning ? 2 : 1)
    return {
      amount,
      summary: `${formatPrice(vehicle.hourly)} per hour × ${hours} hour${hours === 1 ? '' : 's'}${options.returning ? ', including the return hire' : ''}`,
    }
  }

  const airport =
    options.tripType === 'airport'
      ? airportById(options.airportId)
      : matchAirport(`${options.pickup} ${options.dropoff}`)

  if (airport) {
    const fare = airport.prices[options.vehicleId]
    if (fare == null) {
      return {
        amount: null,
        summary: `${airport.name} in a ${vehicle.shortName} is confirmed when you enquire.`,
      }
    }
    const amount = options.returning ? fare * 2 : fare
    return {
      amount,
      summary: `${airport.name} fixed fare${options.returning ? ', including the return journey' : ''}`,
    }
  }

  const hours = minimumHours
  const amount = vehicle.hourly * hours * (options.returning ? 2 : 1)
  return {
    amount,
    summary: `From ${formatPrice(vehicle.hourly)} per hour, ${hours}-hour minimum${options.returning ? ', including the return' : ''}. The final fare is confirmed against the route.`,
  }
}
