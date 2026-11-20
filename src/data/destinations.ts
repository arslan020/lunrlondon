export interface DestinationRegion {
  slug: string
  nav: string
  heading: string
  highlight: string
  intro: string
  cities: string[]
  title: string
  description: string
  image: string
}

export const globalDestinationTitle = 'LUNR | Luxury London Chauffeur Services for International Travellers'

export const globalDestinationDescription =
  'Luxury London chauffeur services for international travellers. Airport arrivals in London, journeys to UK cities, and connections with Europe, the USA and the Middle East.'

export const furtherDestinations = ['Singapore', 'Lagos', 'Abuja', 'Cape Town']

export const destinationRegions: DestinationRegion[] = [
  {
    slug: 'united-kingdom',
    nav: 'United Kingdom',
    heading: 'UK chauffeur destinations',
    highlight: 'UK',
    intro:
      'London is where the car starts. These are the UK cities we drive to, including the ones named for this service and the other major cities a London booking regularly reaches. The fare is confirmed before you travel.',
    cities: [
      'London',
      'Birmingham',
      'Manchester',
      'Leeds',
      'Liverpool',
      'Bristol',
      'Sheffield',
      'Newcastle',
      'Nottingham',
      'Leicester',
      'Coventry',
      'Southampton',
      'Portsmouth',
      'Bournemouth',
      'Basingstoke',
      'Brighton',
      'Reading',
      'Oxford',
      'Cambridge',
      'Windsor',
      'Bath',
      'Cardiff',
      'Edinburgh',
      'Glasgow',
    ],
    title: 'LUNR | UK Chauffeur Destinations',
    description:
      'London chauffeur journeys to major UK cities, including Birmingham, Manchester, Portsmouth, Bournemouth, Basingstoke and London itself.',
    image: '/images/rr-manor-wide.jpg',
  },
  {
    slug: 'europe',
    nav: 'Europe',
    heading: 'European travel connections',
    highlight: 'European',
    intro:
      'These are European cities our clients fly in from, including Paris, Geneva, Zurich and Copenhagen in Denmark. The car is in London. We meet the arrival at the airport or the hotel, then drive on from there.',
    cities: [
      'Paris',
      'Nice',
      'Geneva',
      'Zurich',
      'Frankfurt',
      'Munich',
      'Madrid',
      'Barcelona',
      'Milan',
      'Luxembourg City',
      'Copenhagen',
      'Istanbul',
    ],
    title: 'LUNR | European Travel Connections',
    description:
      'London chauffeur service for travellers arriving from Paris, Nice, Geneva, Zurich, Frankfurt, Munich, Madrid, Barcelona, Milan, Luxembourg, Copenhagen and Istanbul.',
    image: '/images/s-class-palace.jpg',
  },
  {
    slug: 'usa',
    nav: 'USA',
    heading: 'USA travel connections',
    highlight: 'USA',
    intro:
      'For travellers coming into London from the United States. We collect you after you land, or from your London address, and take you on by car.',
    cities: ['New York', 'Los Angeles', 'Miami', 'San Francisco'],
    title: 'LUNR | USA Travel Connections',
    description:
      'London chauffeur service for travellers arriving from New York, Los Angeles, Miami and San Francisco.',
    image: '/images/hourly-arrival.jpg',
  },
  {
    slug: 'middle-east',
    nav: 'Middle East',
    heading: 'Middle East travel connections',
    highlight: 'Middle East',
    intro:
      'For travellers coming into London from the United Arab Emirates, Saudi Arabia and the wider Middle East. We meet the flight in London. The onward journey is by chauffeur from there.',
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Jeddah', 'Dammam', 'Doha', 'Kuwait City', 'Muscat', 'Manama', 'Amman'],
    title: 'LUNR | Middle East Travel Connections',
    description:
      'London chauffeur service for travellers arriving from Dubai, Abu Dhabi, Riyadh, Jeddah, Dammam, Doha, Kuwait City, Muscat, Manama and Amman.',
    image: '/images/s-class-airport.jpg',
  },
]
