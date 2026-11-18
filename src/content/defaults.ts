import { faqGroups } from '../data/faqs'
import { airports, vehicles } from '../data/pricing'
import { services } from '../data/services'
import { testimonials } from '../data/testimonials'
import { siteConfig } from '../siteConfig'
import type { SiteContent } from './types'

const address = `${siteConfig.address.line1}, ${siteConfig.address.line2}`

export const DEFAULT_CONTENT: SiteContent = {
  site: {
    brandName: siteConfig.brandName,
    logo: siteConfig.logo ?? '',
    tagline: siteConfig.tagline,
    phone: siteConfig.phone,
    mobile: siteConfig.mobile,
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    address: { line1: siteConfig.address.line1, line2: siteConfig.address.line2 },
    googleReviewsUrl: siteConfig.googleReviewsUrl,
    privacyPolicyUrl: siteConfig.privacyPolicyUrl,
    socials: { facebook: siteConfig.socials.facebook, instagram: siteConfig.socials.instagram },
    footerText: `From sunrise to moonlight. Luxury never sleeps. ${siteConfig.brandName} is available 24 hours a day, 7 days a week, for airport arrivals, one-way journeys, and hourly hire, with a licensed chauffeur and the fare confirmed before you travel. We accept cryptocurrency.`,
  },
  areas: ['London', 'Heathrow', 'Gatwick', 'Luton', 'Stansted', 'London City', 'Farnborough'],
  minimumHours: 2,
  home: {
    heroHeading: 'A Higher Standard of Chauffeuring. Around the Clock.',
    heroHighlight: 'Around the Clock',
    heroSubtext: 'From sunrise to moonlight, experience chauffeur services where excellence has no closing hours.',
    heroVideo: '/videos/hero.mp4',
    heroImage: '/images/hero.jpg',
    luxuryHeading: 'Luxury Never Sleeps',
    luxuryHighlight: 'Sleeps',
    luxuryParagraphs: [
      `At ${siteConfig.brandName}, we believe true luxury is not simply about where you travel, but how you are treated along the way.`,
      'Every journey is an opportunity to demonstrate our commitment to trust, reliability, respect and honour. From the moment you make your booking to the moment you reach your destination, we place your comfort, time and confidence at the heart of everything we do.',
      'Whether travelling for business, leisure or a special occasion, our approach remains unchanged: professional service, considered attention and an unwavering commitment to the highest standards.',
      'Available 24 hours a day, 7 days a week, we move with the rhythm of your world.',
    ],
    luxurySignoff: `${siteConfig.brandName}. Luxury Never Sleeps.`,
    goldBar: 'From sunrise to moonlight. We know luxury never sleeps.',
    trustHeading: 'Trust Is Our Foundation',
    trustHighlight: 'Trust',
    trustParagraphs: [
      "Confidence is earned, never assumed. Whether you're travelling for business or pleasure, we treat every booking as a responsibility, and every journey with integrity, honesty and accountability.",
      'From private and commercial airport transfers to executive chauffeur travel and close protection, our service is built around three things: your time, your privacy and your peace of mind.',
    ],
    trustTimeHeading: 'Your time matters.',
    trustTimeText: 'Punctuality, preparation and consistency sit at the centre of everything we do. Flights are monitored, routes are planned in advance, and your chauffeur is ready when you are.',
    trustDiscretionHeading: 'Discretion is guaranteed.',
    trustDiscretionText: 'Our chauffeurs and security professionals are trained to be professional, unobtrusive and respectful of your confidentiality, at all times and in every setting.',
    trustImage: '/images/s-class-airport.jpg',
    trustImageLabel: 'Mercedes-Benz S-Class at the airport',
    respectHeading: 'Respect Is Our Standard',
    respectHighlight: 'Respect',
    respectParagraphs: [
      'Every client, every occasion and every destination deserves consideration. We believe in professionalism without exception, discretion without compromise and service without assumption.',
      'Honour is our principle. We stand by our commitments. Our word carries meaning, our conduct reflects our values, and our responsibility extends beyond simply getting you to your destination.',
    ],
    respectImage: '/images/rr-manor-side.jpg',
    reviewsHeading: 'What Our Clients Say',
    reviewsHighlight: 'Clients',
    reviewsText: 'From airport transfers to special occasions, our clients trust us for a smooth, professional service every step of the way.',
    fleetHeading: 'A Fleet Designed for Comfort & Flexibility',
    fleetHighlight: 'Designed',
    fleetText: `The ${siteConfig.brandName} fleet is the Mercedes-Benz E-Class, V-Class and S-Class, the BMW 5 Series, and the Range Rover. All vehicles are:`,
    fleetBullets: [
      'Immaculately cleaned before every journey',
      'Regularly maintained and safety checked',
      'Driven by licensed professional chauffeurs',
    ],
    fleetNote: 'Child and baby seats are available on request and must be arranged in advance.',
    fleetImage: '/images/rr-manor-wide.jpg',
    closingHeading: 'Whenever the World Calls, LUNR Is Ready.',
    closingText: 'From the earliest departure to the latest arrival, experience a service designed around your schedule, your expectations and your peace of mind. Day or night. Every journey. One standard.',
  },
  servicesPage: {
    heading: 'Every Journey. Considered. Every Detail. Delivered.',
    highlight: 'Considered',
    subtext: 'A tailored collection of chauffeur services, available around the clock, designed around the way you travel.',
    paragraphs: [
      `No two journeys are the same. Whether you require a direct transfer, a dedicated chauffeur by the hour, seamless airport transportation or a more security-conscious travel arrangement, ${siteConfig.brandName} provides a considered approach to every booking.`,
      'Our services are built around flexibility, professionalism and the understanding that exceptional service begins long before the journey itself.',
      'Whatever the destination, our standards remain constant.',
    ],
  },
  services,
  fleet: {
    heading: 'Our Luxury Fleet',
    highlight: 'Luxury',
    subtext: 'Our vehicles are chosen for comfort, refinement, and reliability. Every journey is presented in a meticulously prepared car, driven by a licensed chauffeur.',
    image: '/images/lunr-fleet-hero.jpg',
    video: '',
    introHeading: 'Select the Right Vehicle for Your Journey',
    introText: 'Choose an E-Class, V-Class, S-Class, BMW 5 Series, or Range Rover. Hourly hire is priced per hour, and airport journeys use the fixed fares on the booking page.',
    closingHeading: 'Need Help Choosing a Vehicle?',
    closingText: 'Tell us about your journey and we will recommend the right vehicle or provide a quote.',
  },
  vehicles,
  airports,
  faqsPage: {
    eyebrow: 'FAQs',
    heading: 'Frequently Asked Questions',
    subtext: 'Everything you need to know about booking, pricing, our chauffeurs, and our vehicles.',
    sectionHeading: 'Everything You Need to Know',
    sectionText: "Below you will find answers to the questions we are asked most often. If you can't find what you're looking for, our team is happy to help directly.",
    image: '/images/rr-parklane.jpg',
    closingHeading: 'Still Have a Question?',
    closingText: 'Speak to our team today and we will be happy to help.',
  },
  faqs: faqGroups,
  testimonials,
  contact: {
    eyebrow: 'Get in touch',
    heading: 'Someone here when the journey needs a person.',
    lead: `Speak with ${siteConfig.brandName} about a new journey, a change to a booking, or a plan that needs more than a form.`,
    heroImage: '/images/chauffeur.jpg',
    cardEyebrow: 'Get in touch',
    cardHeading: 'Talk to a person, any hour.',
    cardText: 'See a fare online, and reach the team when you want to talk the journey through. We accept cryptocurrency.',
    briefEyebrow: 'Plan the enquiry',
    briefHeading: 'A clear brief. A calmer arrival.',
    briefImage: '/images/contact-brief.jpg',
    briefText: 'A few details help us recommend the right vehicle and confirm the journey clearly.',
    steps: [
      {
        number: '01',
        title: 'Where and when',
        text: 'Collection address, destination, travel date and pickup time. For an airport journey, add the flight number so we can confirm the terminal and follow any change.',
      },
      {
        number: '02',
        title: 'Passengers and luggage',
        text: 'Tell us how many people are travelling and how much luggage you expect, so we can recommend the most comfortable vehicle.',
      },
      {
        number: '03',
        title: 'Anything extra',
        text: 'Include child seats, extra stops, access needs, or a return. We confirm availability and the fare before you travel.',
      },
    ],
  },
  book: { backgroundImage: '/images/fleet-night.jpg' },
  privacy: {
    eyebrow: 'Privacy policy',
    heading: 'How we look after your personal information',
    lead: 'A plain account of the details we ask for, why we use them, and the choices you have.',
    updated: '10 November 2026',
    sections: [
      {
        number: '01',
        kicker: 'The controller for your information',
        title: 'Who is responsible',
        paragraphs: [
          `${siteConfig.brandName} is responsible for the personal information collected on this website when you ask about a journey or request a booking. The registered address is ${address}.`,
          siteConfig.email
            ? `A privacy question can be sent to ${siteConfig.email}, or through the contact page. Include enough detail for us to find the enquiry or booking, and leave out sensitive information we do not need.`
            : 'A privacy question can be sent through the contact page. Include enough detail for us to find the enquiry or booking, and leave out sensitive information we do not need.',
        ],
      },
      {
        number: '02',
        kicker: 'What we collect',
        title: 'Information we receive',
        paragraphs: [
          'A booking request can include your name, telephone number, email address, travel date and time, pickup and destination, the airport where that applies, the hours for hourly hire, whether you need a return, the vehicle you choose, and any note you add.',
          'The contact form asks for your name, email address, an optional telephone number, and your message. This website does not take card payments, and it does not store card numbers.',
        ],
      },
      {
        number: '03',
        kicker: 'Our reasons',
        title: 'Why we use it',
        paragraphs: [
          'We use these details to reply, price the journey you described, and arrange the chauffeur service if you go ahead. That includes contacting you about the booking and noting a change you ask for.',
          'We also keep what we need to run the service properly: to see what was requested, to deal with a later question about that journey, and to prevent misuse. We do not use your details for unrelated marketing.',
        ],
      },
      {
        number: '04',
        kicker: 'Sharing',
        title: 'Who else sees it',
        paragraphs: [
          `${siteConfig.brandName} uses enquiry and booking details to respond and arrange the journey. The form sends those details by email to the bookings inbox through Resend. This website does not pass them to a payment company, a call-tracking service, or an advertising network.`,
          'A directions link opens a map on a separate page. What you do there is covered by that map service, not by this policy.',
        ],
      },
      {
        number: '05',
        kicker: 'Retention',
        title: 'How long information remains',
        paragraphs: [
          'An enquiry is kept for as long as we need it to reply or to sort out a question about it. Booking details stay for as long as we need them to complete the journey and keep a clear record of what was arranged.',
          'We do not keep personal information with no purpose. Access is limited to the people who need it to handle your enquiry or journey.',
        ],
      },
      {
        number: '06',
        kicker: 'Your data protection rights',
        title: 'Your choices',
        paragraphs: [
          'You can ask for a copy of the personal information we hold, ask us to correct it, ask us to delete it, or ask us to limit how we use it. You can also object to a use that is not required to arrange a journey you have requested.',
          'Send the request through the contact page. We may ask you to confirm who you are, so the details are not shared with the wrong person. If a record has to be kept, we will tell you why it cannot be deleted yet.',
        ],
      },
      {
        number: '07',
        kicker: 'How to reach us or the ICO',
        title: 'Questions and complaints',
        paragraphs: [
          'Please contact us first through the contact page, so we can look at what happened and reply. You can also complain to the UK Information Commissioner’s Office. The ICO publishes its own contact and complaint details.',
        ],
      },
    ],
  },
}
