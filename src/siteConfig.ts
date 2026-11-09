// Central place to edit brand name, logo, contact details and media.
// Replace the placeholder values below once the client's logo and photos are ready.

export const siteConfig = {
  brandName: 'LUNR',
  logo: '/images/logo.png' as string | null,
  tagline: 'Luxury Chauffeur Service in London & Across the UK',
  phone: '', // add the client's real phone number here
  mobile: '', // add the client's real mobile number here
  email: '', // add the client's real email address here
  address: {
    line1: 'Your Business Address',
    line2: 'Your City, Postcode',
  },
  googleReviewsUrl: '#',
  privacyPolicyUrl: '/privacy-policy',
  socials: {
    facebook: '#',
    instagram: '#',
  },
}

export type SiteConfig = typeof siteConfig
