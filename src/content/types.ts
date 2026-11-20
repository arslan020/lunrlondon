import type { FaqGroup, ServiceData, Testimonial } from '../types'
import type { AirportFare, Vehicle } from '../data/pricing'

export type SiteSettings = {
  brandName: string
  logo: string
  tagline: string
  phone: string
  mobile: string
  whatsapp: string
  email: string
  address: { line1: string; line2: string }
  googleReviewsUrl: string
  privacyPolicyUrl: string
  socials: { facebook: string; instagram: string }
  footerText: string
}

export type HomeContent = {
  heroHeading: string
  heroHighlight: string
  heroSubtext: string
  heroVideo: string
  heroImage: string
  luxuryHeading: string
  luxuryHighlight: string
  luxuryParagraphs: string[]
  luxurySignoff: string
  goldBar: string
  trustHeading: string
  trustHighlight: string
  trustParagraphs: string[]
  trustTimeHeading: string
  trustTimeText: string
  trustDiscretionHeading: string
  trustDiscretionText: string
  trustImage: string
  trustImageLabel: string
  respectHeading: string
  respectHighlight: string
  respectParagraphs: string[]
  respectImage: string
  reviewsHeading: string
  reviewsHighlight: string
  reviewsText: string
  fleetHeading: string
  fleetHighlight: string
  fleetText: string
  fleetBullets: string[]
  fleetNote: string
  fleetImage: string
  closingHeading: string
  closingText: string
}

export type PageIntro = {
  heading: string
  highlight: string
  subtext: string
  paragraphs: string[]
}

export type FleetContent = {
  heading: string
  highlight: string
  subtext: string
  image: string
  video: string
  introHeading: string
  introText: string
  closingHeading: string
  closingText: string
}

export type FaqsPageContent = {
  eyebrow: string
  heading: string
  subtext: string
  sectionHeading: string
  sectionText: string
  image: string
  closingHeading: string
  closingText: string
}

export type ContactStep = { number: string; title: string; text: string }

export type ContactContent = {
  eyebrow: string
  heading: string
  lead: string
  heroImage: string
  cardEyebrow: string
  cardHeading: string
  cardText: string
  briefEyebrow: string
  briefHeading: string
  briefImage: string
  briefText: string
  steps: ContactStep[]
}

export type PrivacySection = {
  number: string
  kicker: string
  title: string
  paragraphs: string[]
}

export type PrivacyContent = {
  eyebrow: string
  heading: string
  lead: string
  updated: string
  sections: PrivacySection[]
}

export type DestinationContent = {
  heroImage: string
  unitedKingdomImage: string
  europeImage: string
  usaImage: string
  middleEastImage: string
}

export type SiteContent = {
  site: SiteSettings
  areas: string[]
  minimumHours: number
  home: HomeContent
  destinations: DestinationContent
  servicesPage: PageIntro
  services: ServiceData[]
  fleet: FleetContent
  vehicles: Vehicle[]
  airports: AirportFare[]
  faqsPage: FaqsPageContent
  faqs: FaqGroup[]
  testimonials: Testimonial[]
  contact: ContactContent
  book: { backgroundImage: string }
  privacy: PrivacyContent
}
