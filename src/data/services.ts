import type { ServiceData } from '../types'
import { siteConfig } from '../siteConfig'

const closeProtectionBooking = siteConfig.email
  ? `To book, email ${siteConfig.email} with the dates, the movements, and how visible the car should be. We accept cryptocurrency.`
  : 'To book, email us through the contact page with the dates, the movements, and how visible the car should be. We accept cryptocurrency.'

export const services: ServiceData[] = [
  {
    slug: 'as-directed',
    navLabel: 'As Directed (Hourly)',
    heroHeading: 'As Directed Hourly Chauffeur Hire',
    heroHighlight: 'Hourly',
    heroSubtext:
      'Keep your chauffeur and vehicle on standby for as long as you need. The car stays with you between meetings, fittings, or evening plans.',
    heroImage: '/images/hourly-arrival.jpg',
    cardImage: '/images/hourly-arrival.jpg',
    sections: [
      {
        heading: 'The Car Stays With You',
        highlight: 'Stays',
        image: '/images/airport-arrival.jpg',
        paragraphs: [
          'As-directed hire is charged by the hour, and the chauffeur does not leave between stops. The car waits while you are in a meeting, at a fitting, or inside a venue, then moves on when you are ready.',
          'It suits a day that has not been pinned to one pickup and one drop-off. You keep the vehicle for the hours you book, and the route can change as the day goes on.',
        ],
      },
      {
        heading: 'Built Around Your Day',
        highlight: 'Your Day',
        image: '/images/rr-hotel.jpg',
        imageFirst: true,
        paragraphs: [
          'A morning of meetings, an afternoon of appointments, and an evening across two or three addresses can sit on one booking. You tell the chauffeur the next stop when you come out.',
          'The car is cleaned and in place before the first collection. From there the hours are yours, up to the time you booked.',
        ],
        buttonLabel: 'Book Hourly Hire',
        buttonTo: '/book',
      },
      {
        layout: 'gold',
        heading: 'Distinguished Chauffeurs, Always at Your Service.',
        highlight: 'Chauffeurs',
        paragraphs: [
          'Every hourly booking is accompanied by a licensed chauffeur who remains with you throughout, so your itinerary never needs repeating at each stop.',
          'Your chauffeur arrives promptly, is immaculately presented, and remains on hand for the duration of your booking, ready the moment you are.',
        ],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Hourly Hire for a Full Day of Stops',
        highlight: 'Hourly',
        image: '/images/rr-manor-angle.jpg',
        paragraphs: [
          'Clients use as-directed hire when the car needs to be nearby, not booked again for every leg. It is a regular choice for:',
        ],
        bullets: [
          'A day of meetings across London',
          'Fittings, viewings, and private appointments',
          'Dinner and an evening with more than one stop',
          'Anyone who wants the car waiting, not rebooked',
        ],
      },
      {
        heading: 'Clear Hourly Rates',
        highlight: 'Hourly',
        image: '/images/s-class-ivy.jpg',
        imageFirst: true,
        paragraphs: [
          'The minimum booking is two hours. You choose how many hours you need, and the congestion charge is included in the rate you confirm. The hourly rates are:',
        ],
        bullets: [
          'Mercedes-Benz E-Class, £50 per hour',
          'Mercedes-Benz S-Class, £75 per hour',
          'Mercedes-Benz V-Class, £70 per hour',
          'Range Rover, £100 per hour',
        ],
        buttonLabel: 'Book Hourly Hire',
        buttonTo: '/book',
      },
      {
        layout: 'bar',
        heading: 'Hourly enquiry',
        paragraphs: ['Tell us the hours, the vehicle, and where to collect you.'],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Flexible Cancellations and a Clear Quote',
        highlight: 'Flexible',
        image: '/images/e-class-terrace.jpg',
        imageFirst: true,
        paragraphs: [
          'Plans change. Cancel at no charge up to 24 hours before the pickup. Inside those 24 hours the booking is charged in full.',
          'The hourly rate and the number of hours are shown before you confirm. If the day runs longer, extra hours are agreed at the same rate.',
        ],
        buttonLabel: 'Check Out Our FAQs',
        buttonTo: '/faqs',
      },
      {
        heading: 'Vehicles Ready When You Are',
        highlight: 'Ready',
        image: '/images/v-class-hotel.jpg',
        imageFirst: true,
        paragraphs: [
          'Hourly hire is available in the E-Class, S-Class, V-Class, and Range Rover. The V-Class suits a larger party. The saloons and the Range Rover suit up to three or four passengers.',
          'Every vehicle is:',
        ],
        bullets: [
          'Cleaned before the first collection',
          'Maintained and safety checked',
          'Driven by a licensed chauffeur',
        ],
        buttonLabel: 'Book Hourly Hire',
        buttonTo: '/book',
      },
    ],
    closingHeading: 'Book As Directed Hire',
    closingHighlight: 'As Directed',
    closingText: 'Tell us the hours, the vehicle, and where to collect you. The rate is confirmed before the chauffeur sets off.',
    closingButtonLabel: 'Book Now',
    closingButtonTo: '/book',
  },
  {
    slug: 'one-way-transfer',
    navLabel: 'One Way Transfer',
    heroHeading: 'One Way Chauffeur Transfers',
    heroHighlight: 'One Way',
    heroSubtext:
      'A direct chauffeur journey from one address to another, across London and the UK, with the vehicle prepared before you step in.',
    heroImage: '/images/rr-side-wide.jpg',
    cardImage: '/images/rr-hotel-door.jpg',
    imagePosition: 'object-[center_60%]',
    sections: [
      {
        heading: 'Point to Point, Without the Wait',
        highlight: 'Point to Point',
        image: '/images/rr-vip.jpg',
        imageFit: 'contain',
        paragraphs: [
          'A one-way transfer is a single collection and a single drop-off: a hotel, an office, a private address, or a venue. The car is prepared before you step in, and the journey ends when you arrive.',
          'If either end is London City, Heathrow, Gatwick, Luton, Stansted, or Farnborough, the fixed airport fare applies. Every other route is priced from the hourly rate and confirmed against the exact journey.',
        ],
      },
      {
        heading: 'One Collection, One Drop-off',
        highlight: 'Collection',
        image: '/images/e-class-hotel.jpg',
        imageFirst: true,
        paragraphs: [
          'This is the booking for a journey that does not need the car to wait. You are collected at the agreed time, and taken straight to the address.',
          'The route is set before the chauffeur sets off, so the arrival time is planned rather than left to a last-minute booking.',
        ],
        buttonLabel: 'Book a One Way Transfer',
        buttonTo: '/book',
      },
      {
        layout: 'gold',
        heading: 'Professional Chauffeurs You Can Rely On',
        highlight: 'Chauffeurs',
        paragraphs: [
          'Every one-way journey is driven by a licensed chauffeur. The car is on time for the collection, and the handover at the other end is kept simple.',
          'The same care applies to a short trip across London and to a longer journey out of the city. You are met at the door, not at a rank.',
        ],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Journeys a One Way Transfer Covers',
        highlight: 'One Way',
        image: '/images/rr-street.jpg',
        paragraphs: [
          'Use a one-way transfer when you need the car for the journey itself, not for the hours in between. It is booked for:',
        ],
        bullets: [
          'A hotel to an office or a private address',
          'Home to a venue',
          'A station, when you want the car at the kerb',
          'An airport, when the fixed fare applies',
        ],
      },
      {
        heading: 'How the Fare Is Worked Out',
        highlight: 'Fare',
        image: '/images/s-class-palace.jpg',
        imageFirst: true,
        paragraphs: [
          'Airport journeys use the fixed fare for that airport and vehicle. Any other one-way route is priced from the hourly rate, with a two-hour minimum, and confirmed against the route before you travel.',
          'Add a return when you need the same car to collect you later. A return doubles the fare. The from rates are:',
        ],
        bullets: [
          'Mercedes-Benz E-Class, from £50 per hour',
          'Mercedes-Benz S-Class, from £75 per hour',
          'Mercedes-Benz V-Class, from £70 per hour',
          'Range Rover, from £100 per hour',
        ],
        buttonLabel: 'Book a One Way Transfer',
        buttonTo: '/book',
      },
      {
        layout: 'bar',
        heading: 'One way enquiry',
        paragraphs: ['Share the pickup and the drop-off, and we will confirm the fare before you travel.'],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Flexible Cancellations and a Clear Quote',
        highlight: 'Flexible',
        image: '/images/e-class-side.jpg',
        paragraphs: [
          'Plans change. Cancel at no charge up to 24 hours before the pickup. Inside those 24 hours the booking is charged in full.',
          'The fare is shown when you book. The congestion charge is included in that quote, so it is not added afterwards.',
        ],
        buttonLabel: 'Check Out Our FAQs',
        buttonTo: '/faqs',
      },
      {
        heading: 'Vehicles for a Direct Journey',
        highlight: 'Direct',
        image: '/images/v-class-bridge.jpg',
        imageFirst: true,
        paragraphs: [
          'One-way transfers run in the E-Class, S-Class, V-Class, and Range Rover. Choose the saloon or the Range Rover for up to three or four passengers, or the V-Class when the party is larger.',
          'Every vehicle is:',
        ],
        bullets: [
          'Cleaned before collection',
          'Maintained and safety checked',
          'Driven by a licensed chauffeur',
        ],
        buttonLabel: 'Book a One Way Transfer',
        buttonTo: '/book',
      },
    ],
    closingHeading: 'Book a One Way Transfer',
    closingHighlight: 'One Way',
    closingText: 'Share the pickup and the drop-off. We confirm the vehicle and the fare before you travel.',
    closingButtonLabel: 'Book Now',
    closingButtonTo: '/book',
  },
  {
    slug: 'airport-transfer',
    navLabel: 'Airport Transfer',
    heroHeading: 'Luxury Airport Transfers London',
    heroHighlight: 'Luxury',
    heroSubtext:
      'Meet and greet, live flight tracking, and a fixed fare to Heathrow, Gatwick, Stansted, Luton, London City, and Farnborough.',
    heroImage: '/images/airport-hero.jpg',
    sections: [
      {
        heading: 'Where Every Journey Begins in Comfort',
        highlight: 'Comfort',
        image: '/images/airport-comfort.jpg',
        paragraphs: [
          'Whether you are landing in London or leaving for a flight, the transfer is set up so the airport is not the stressful part of the day. The car is waiting, and the chauffeur already knows the terminal.',
          'Meet and greet, live flight tracking, and a prepared vehicle come with the booking. If the schedule shifts, the collection moves with it, and the rest of the journey stays calm.',
        ],
      },
      {
        heading: 'A Seamless Arrival and Departure Experience',
        highlight: 'Seamless',
        image: '/images/airport-arrival.jpg',
        imageFirst: true,
        paragraphs: [
          'Airport work depends on timing. The flight is watched as it happens, so an early landing or a delay does not leave you standing outside, and the chauffeur is not guessing when to set off.',
          'On arrival you are met, luggage is taken, and you are walked to the car. For a departure, the route is planned so you reach the terminal with time to spare. The change from plane to car stays quiet and straightforward.',
        ],
        buttonLabel: 'Book Your Airport Transfer Today',
        buttonTo: '/book',
      },
      {
        layout: 'gold',
        heading: 'Professional Chauffeurs You Can Rely On',
        highlight: 'Chauffeurs',
        paragraphs: [
          'Every airport booking is driven by a licensed chauffeur who knows the terminals, the stands, and how to keep the handover discreet.',
          'A solo traveller, a family, and an executive get the same attention. The car is on time, the presentation is tidy, and the airport process is handled without fuss.',
        ],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Serving London and the Major Airports',
        highlight: 'Airports',
        image: '/images/airport-planes.jpg',
        paragraphs: [
          'Fixed fares cover London City, Heathrow, Gatwick, Luton, Stansted, and Farnborough, in either direction. Other UK airports can be quoted from the route. The standard stays the same at night, early morning, and in the middle of the day.',
          'These transfers are booked regularly for:',
        ],
        bullets: [
          'Business and corporate travellers',
          'Visitors arriving from overseas',
          'Private clients and families',
          'Anyone who wants a discreet arrival',
        ],
      },
      {
        heading: 'What’s Included in Our Luxury Airport Transfers',
        highlight: 'Luxury',
        image: '/images/airport-included.jpg',
        imageFirst: true,
        paragraphs: [
          'The fare you are quoted is the fare you pay. The congestion charge is already inside it. Child and baby seats can be added if you ask when you book.',
          'Every airport transfer includes:',
        ],
        bullets: [
          'Live flight tracking',
          'Professional meet and greet',
          'Up to 60 minutes of waiting time at the airport',
          'Help with luggage',
          'Congestion zone charges included in the quoted price',
        ],
        buttonLabel: 'Book Your Airport Transfer Today',
        buttonTo: '/book',
      },
      {
        layout: 'bar',
        heading: 'Airport enquiry',
        paragraphs: ['Tell us the flight and the address, and we will confirm the car and the fare.'],
        buttonLabel: 'Contact Us',
        buttonTo: '/contact',
      },
      {
        heading: 'Flexible Cancellations and Clear Pricing',
        highlight: 'Flexible',
        image: '/images/fleet-hero.jpg',
        paragraphs: [
          'Plans change. Cancel at no charge up to 24 hours before the pickup. Inside those 24 hours the booking is charged in full.',
          'The price is shown when you book, by airport and by vehicle. Regular travellers, and bookings that need more than one car, can be quoted separately and that rate is the one you confirm.',
        ],
        buttonLabel: 'Check Out Our FAQs',
        buttonTo: '/faqs',
      },
      {
        heading: 'Vehicles Designed for Comfort and Space',
        highlight: 'Designed',
        image: '/images/airport-vehicles.jpg',
        imageFirst: true,
        paragraphs: [
          'Airport transfers run in the E-Class, S-Class, V-Class, and Range Rover. Each is chosen for a quiet cabin and room for passengers and luggage.',
          'All vehicles are:',
        ],
        bullets: [
          'Cleaned before every journey',
          'Maintained and safety checked',
          'Driven by a licensed chauffeur',
        ],
        buttonLabel: 'Book Your Airport Transfer Today',
        buttonTo: '/book',
      },
    ],
    closingHeading: 'Book a Luxury Airport Transfer',
    closingHighlight: 'Luxury',
    closingText:
      'Share the flight and the address. We confirm the vehicle and the fare, and the journey starts and ends on time.',
    closingButtonLabel: 'Book Now',
    closingButtonTo: '/book',
  },
  {
    slug: 'close-protection',
    navLabel: 'Close Protection',
    heroHeading: 'Close Protection Services',
    heroHighlight: 'Close Protection',
    heroSubtext:
      'A private car with the route planned before you leave, for clients who want the journey kept quiet.',
    heroImage: '/images/close-protection.jpg',
    imagePosition: 'object-[center_40%]',
    sections: [
      {
        heading: 'Discreet Travel, Without the Show',
        highlight: 'Discreet',
        image: '/images/cp-travel.jpg',
        imageRatio: 'aspect-[3/2]',
        paragraphs: [
          'A close protection booking is chauffeured travel with the day arranged in advance. You set the movements. We confirm the vehicle, the timing, and how the arrival should feel.',
          'The car stays with that brief, whether it is one journey, a working day of several stops, or a run of days.',
        ],
      },
      {
        heading: 'Professional Close Protection Driving',
        highlight: 'Professional',
        image: '/images/cp-london.jpg',
        imageFirst: true,
        paragraphs: [
          'The route is agreed before you leave, including another option if the first is no longer suitable. The chauffeur stays with the booking and keeps the handover quiet.',
          'It suits a private appointment, a public appearance, or a day that should not draw attention to the car.',
        ],
        buttonLabel: 'Email us to book',
        buttonTo: '/contact',
      },
      {
        layout: 'gold',
        heading: 'Discretion and Confidentiality as Standard',
        highlight: 'Discretion',
        paragraphs: [
          'The details of the booking stay between you and the team. Cars are kept understated, so the vehicle itself is not the point of the day.',
          'The same approach covers an executive diary, a private visit, or an event arrival.',
        ],
        buttonLabel: 'Book Now',
        buttonTo: '/contact',
      },
      {
        heading: 'What the Booking Covers',
        highlight: 'Booking',
        image: '/images/cp-training.jpg',
        imageRatio: 'aspect-[3/2]',
        paragraphs: ['A close protection booking can include:'],
        bullets: [
          'A chauffeur for the movements you set out',
          'The route agreed before the day',
          'A vehicle chosen for the journey and how visible it should be',
          'The day run to the brief you give us',
        ],
        buttonLabel: 'Email us to book',
        buttonTo: '/contact',
      },
      {
        heading: 'Flexible Close Protection',
        highlight: 'Flexible',
        image: '/images/cp-assignment.jpg',
        imageRatio: 'aspect-[3/2]',
        imageFirst: true,
        paragraphs: [
          'Close protection driving is arranged for:',
        ],
        bullets: [
          'Corporate executives',
          'Private clients',
          'Visitors who want a controlled arrival',
          'Legal appointments',
          'Clients at events',
        ],
      },
      {
        layout: 'bar',
        heading: 'Close protection enquiry',
        paragraphs: ['Email us to book. Share the dates and the movements, and we will confirm the vehicle.'],
        buttonLabel: 'Email us to book',
        buttonTo: '/contact',
      },
      {
        heading: 'Vehicles Prepared for the Assignment',
        highlight: 'Vehicles',
        image: '/images/cp-vehicles.jpg',
        paragraphs: [
          'The car is chosen with you, against the route and how visible it should be. Cars used for close protection are:',
        ],
        bullets: [
          'Maintained and safety checked',
          'Prepared before each assignment',
          'Driven by a licensed chauffeur',
        ],
      },
      {
        heading: 'Clear Communication and a Clear Quote',
        highlight: 'Communication',
        image: '/images/cp-officer.jpg',
        imageFirst: true,
        paragraphs: [
          'The quote follows a short brief: the dates, the movements, the vehicle, and how quiet the arrival should be.',
          closeProtectionBooking,
        ],
      },
    ],
    closingHeading: 'Arrange Close Protection',
    closingHighlight: 'Arrange',
    closingText:
      'Email the outline. We come back with how the journey would be covered, and the vehicle that fits it.',
    closingButtonLabel: 'Email us to book',
    closingButtonTo: '/contact',
  },
]

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug)
