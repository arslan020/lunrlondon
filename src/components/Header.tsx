import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { services } from '../data/services'

function Header() {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuTop, setMenuTop] = useState(80)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setMenuTop(headerRef.current.offsetHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mobileOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
      isActive ? 'text-brand-primary' : 'text-white hover:text-brand-primary'
    }`

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:py-5">
        <Link to="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          {siteConfig.logo ? (
            <img src={siteConfig.logo} alt={siteConfig.brandName} className="h-12 w-auto sm:h-14" />
          ) : (
            <span className="font-serif text-2xl font-medium uppercase tracking-[0.32em] text-brand-primary sm:text-3xl">
              {siteConfig.brandName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-7">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <NavLink
              to="/chauffeur-services"
              className={`${navLinkClass({ isActive: false })} flex items-center gap-1`}
            >
              Services
              <svg viewBox="0 0 12 8" className="h-2 w-2 fill-current">
                <path d="M6 8 0 0h12z" />
              </svg>
            </NavLink>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-64 pt-3">
                <ul className="rounded-lg border border-white/10 bg-[#141413] py-2 shadow-xl">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`/chauffeur-services/${service.slug}`}
                        className="block px-4 py-2.5 text-sm font-medium normal-case tracking-normal text-white hover:bg-white/5 hover:text-brand-primary"
                      >
                        {service.navLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <NavLink to="/our-luxury-fleet" className={navLinkClass}>
            Our Fleet
          </NavLink>
          <NavLink to="/faqs" className={navLinkClass}>
            FAQs
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </nav>

        <Link
          to="/book"
          className="hidden shrink-0 items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-primary-contrast shadow-sm transition hover:-translate-y-px lg:inline-flex"
        >
          Book Now
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 bg-white transition ${mobileOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
            />
            <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-white transition ${mobileOpen ? 'opacity-0' : ''}`} />
            <span
              className={`absolute left-0 h-0.5 w-6 bg-white transition ${mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
            />
          </span>
        </button>
      </div>
    </header>

      {mobileOpen && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-1 overflow-y-auto border-t border-white/10 bg-black px-5 py-4 lg:hidden"
          style={{ top: menuTop }}
        >
          <Link to="/" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Home
          </Link>
          <Link
            to="/chauffeur-services"
            onClick={() => setMobileOpen(false)}
            className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            Services
          </Link>
          <ul className="flex flex-col gap-1 border-l border-white/10 pl-4">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/chauffeur-services/${service.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-neutral-300"
                >
                  {service.navLabel}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/our-luxury-fleet" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Our Fleet
          </Link>
          <Link to="/faqs" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            FAQs
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Contact Us
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-brand-primary-contrast"
          >
            Book Now
          </Link>
          {siteConfig.phone && (
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary"
            >
              {siteConfig.phone}
            </a>
          )}
        </nav>
      )}
    </>
  )
}

export default Header
