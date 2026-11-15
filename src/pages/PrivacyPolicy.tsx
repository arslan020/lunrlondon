import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useContent } from '../content/ContentProvider'

function PrivacyPolicy() {
  const { site: siteConfig, privacy } = useContent()
  return (
    <div className="bg-black text-white">
      <section className="px-4 pb-6 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">{privacy.eyebrow}</p>
          <h1 className="mt-4 max-w-[16ch] font-serif text-4xl font-medium leading-[1.08] text-white sm:text-6xl">
            {privacy.heading}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-300 sm:text-base">{privacy.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/book">Book now / Get quote</Button>
            <Button to="/contact" variant="outline">
              Contact
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-3xl border-t border-white/10 pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-primary">
              Home
            </Link>
            <span className="px-2 text-neutral-600">/</span>
            <span className="text-neutral-200">Privacy Policy</span>
          </nav>
          <p className="mt-4 text-sm text-neutral-400">
            {siteConfig.brandName} · Updated {privacy.updated}
          </p>

          <div className="mt-12 space-y-12">
            {privacy.sections.map((section) => (
              <article key={section.number}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                  {section.number} — {section.kicker}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-[15px] leading-relaxed text-neutral-300 sm:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.number === '07' && (
                  <a
                    href="https://ico.org.uk/make-a-complaint/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm text-brand-primary underline underline-offset-4 hover:text-brand-secondary"
                  >
                    Your data protection rights at the ICO
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Keep exploring</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link to="/book" className="text-white hover:text-brand-primary">
                Book now / Get quote
              </Link>
              <Link to="/chauffeur-services" className="text-white hover:text-brand-primary">
                Our services
              </Link>
              <Link to="/our-luxury-fleet" className="text-white hover:text-brand-primary">
                Our fleet
              </Link>
              <Link to="/contact" className="text-white hover:text-brand-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
