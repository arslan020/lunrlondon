// Central place to edit brand name, logo, contact details and media.
// Replace the placeholder values below once the client's logo and photos are ready.

export const siteConfig = {
  brandName: 'LUNR',
  logo: '/images/logo.png' as string | null,
  tagline: 'Luxury Chauffeur Services | Available 24/7',
  phone: '', // add the client's real phone number here
  mobile: '', // add the client's real mobile number here
  whatsapp: '+44 7376 444833',
  email: 'bookings@lunrlondon.co.uk',
  address: {
    line1: 'Centre 42, 42 Watling Street',
    line2: 'Radlett, Herts, England, WD7 7NN',
  },
  googleReviewsUrl: '#',
  privacyPolicyUrl: '/privacy-policy',
  socials: {
    facebook: '#',
    instagram: '#',
  },
}

export type SiteConfig = typeof siteConfig
