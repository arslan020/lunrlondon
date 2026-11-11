export interface ServiceFeatureSection {
  heading: string
  highlight?: string
  paragraphs: string[]
  bullets?: string[]
  buttonLabel?: string
  buttonTo?: string
  image?: string
  imageFirst?: boolean
  layout?: 'split' | 'gold' | 'bar'
}

export interface ServiceData {
  slug: string
  navLabel: string
  heroHeading: string
  heroHighlight?: string
  heroSubtext: string
  heroImage?: string
  cardImage?: string
  imagePosition?: string
  sections: ServiceFeatureSection[]
  closingHeading: string
  closingHighlight?: string
  closingText: string
  closingButtonLabel: string
  closingButtonTo?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  groupTitle: string
  items: FaqItem[]
}

export interface Testimonial {
  name: string
  quote: string
}
