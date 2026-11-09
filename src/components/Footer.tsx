import { Link } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { services } from '../data/services'

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <div>
          <Link to="/" className="mb-5 inline-flex items-center">
            {siteConfig.logo ? (
              <img src={siteConfig.logo} alt={siteConfig.brandName} className="h-16 w-auto" />
            ) : (
              <span className="font-serif text-3xl font-medium uppercase tracking-[0.28em] text-brand-primary">
                {siteConfig.brandName}
              </span>
            )}
          </Link>
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-neutral-400">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{' '}
            apply.
          </p>
          <Link to={siteConfig.privacyPolicyUrl} className="mt-3 inline-block text-sm text-white hover:text-brand-primary">
            Our Privacy Policy
          </Link>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-2xl text-brand-secondary">Services</h3>
          <ul className="space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/chauffeur-services/${service.slug}`} className="text-white hover:text-brand-primary">
                  {service.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-2xl text-brand-secondary">Contact Us</h3>
          <ul className="space-y-3 text-sm text-white">
            {siteConfig.phone && (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-brand-primary" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
                  <PhoneIcon />
                  {siteConfig.phone}
                </a>
              </li>
            )}
            {siteConfig.mobile && (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-brand-primary" href={`tel:${siteConfig.mobile.replace(/\s/g, '')}`}>
                  <MobileIcon />
                  {siteConfig.mobile}
                </a>
              </li>
            )}
            {siteConfig.email && (
              <li>
                <a className="break-all hover:text-brand-primary" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </li>
            )}
            <li className="leading-relaxed text-neutral-200">
              {siteConfig.address.line1}
              <br />
              {siteConfig.address.line2}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 text-center text-xs text-neutral-500 sm:flex-row sm:text-left">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </span>
          <a href="#top" className="hover:text-brand-primary">
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8z" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 18a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 12 20zM8 5v11h8V5H8z" />
    </svg>
  )
}

export default Footer
