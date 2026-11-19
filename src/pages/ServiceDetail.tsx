import { Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import ImagePlaceholder from '../components/ImagePlaceholder'
import CTASection from '../components/CTASection'
import GoldCtaBar from '../components/GoldCtaBar'
import Button from '../components/Button'
import UKMapGraphic from '../components/UKMapGraphic'
import TermsNote from '../components/TermsNote'
import { useContent } from '../content/ContentProvider'
import { airportTerms, hourlyTerms, oneWayTerms } from '../data/pricing'
import type { ServiceFeatureSection } from '../types'

function termsFor(slug: string, minimumHours: number) {
  if (slug === 'as-directed') return hourlyTerms(minimumHours)
  if (slug === 'one-way-transfer') return oneWayTerms
  if (slug === 'airport-transfer') return airportTerms
  return 'Quoted from the brief before you travel. Cancel free up to 24 hours before pickup.'
}

function currentCopy(text: string, minimumHours: number) {
  return text
    .replaceAll('The minimum booking is two hours. ', `The minimum booking is ${minimumHours} hours. `)
    .replaceAll('with a two-hour minimum, and confirmed against the route before you travel.', 'from the minutes and miles, and confirmed before you travel.')
}

function headingWithHighlight(heading: string, highlight?: string) {
  if (!highlight || !heading.includes(highlight)) return heading
  const [before, after] = heading.split(highlight)
  return (
    <>
      {before}
      <em className="italic">{highlight}</em>
      {after}
    </>
  )
}

function GoldPanel({ section, terms }: { section: ServiceFeatureSection; terms: string }) {
  return (
    <section className="no-reveal py-6 md:py-8">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1rem] bg-brand-secondary px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <UKMapGraphic className="pointer-events-none absolute right-2 top-1/2 h-[108%] w-auto max-w-[64%] -translate-y-1/2 object-contain sm:right-6 sm:h-[130%] sm:max-w-[58%]" />
          <div className="relative max-w-xl">
            <h2 className="font-serif text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-[1.1] text-brand-dark">
              {headingWithHighlight(section.heading, section.highlight)}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 leading-relaxed text-brand-dark/90">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-5 space-y-2 text-sm text-brand-dark/90">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="relative pl-6">
                    <span className="absolute left-0 top-[0.45em] h-2 w-2 rounded-[2px] bg-brand-dark" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
            {section.buttonLabel && (
              <div className="mt-7">
                <Button to={section.buttonTo ?? '/contact'} variant="dark">
                  {section.buttonLabel}
                </Button>
              </div>
            )}
            <div className="mt-6">
              <TermsNote tone="dark">{terms}</TermsNote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { services, minimumHours } = useContent()
  const service = slug ? services.find((item) => item.slug === slug) : undefined
  const terms = service ? termsFor(service.slug, minimumHours) : ''

  if (!service) {
    return <Navigate to="/chauffeur-services" replace />
  }

  return (
    <>
      <PageHero
        eyebrow="Services"
        heading={service.heroHeading}
        highlight={service.heroHighlight}
        subtext={service.heroSubtext}
        image={service.heroImage}
        video={service.heroVideo || undefined}
        imagePosition={service.imagePosition}
      />

      <div>
        {service.sections.map((section) => {
          if (section.layout === 'bar') {
            return (
              <section key={section.heading} className="py-6 md:py-8">
                <GoldCtaBar
                  text={section.paragraphs[0]}
                  buttonLabel={section.buttonLabel}
                  buttonTo={section.buttonTo}
                />
                <div className="mx-auto mt-4 max-w-content px-4 sm:px-6">
                  <TermsNote>{terms}</TermsNote>
                </div>
              </section>
            )
          }

          if (section.layout === 'gold') {
            return <GoldPanel key={section.heading} section={section} terms={terms} />
          }

          return (
            <section key={section.heading}>
              <div className={`mx-auto grid max-w-content items-center gap-8 px-4 py-10 sm:px-6 md:py-16 ${section.image ? 'lg:grid-cols-2 lg:gap-12' : ''}`}>
                <div className={section.image ? (section.imageFirst ? 'order-2' : 'order-2 lg:order-1') : ''}>
                  <SectionHeading heading={section.heading} highlight={section.highlight} />
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-5 leading-relaxed text-neutral-200">
                      {currentCopy(paragraph, minimumHours)}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-5 space-y-2 text-sm text-neutral-300">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="relative pl-6">
                          <span className="absolute left-0 top-[0.45em] h-2 w-2 rounded-[2px] bg-brand-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.buttonLabel && (
                    <div className="mt-8">
                      <Button to={section.buttonTo ?? '/contact'}>{section.buttonLabel}</Button>
                    </div>
                  )}
                </div>
                {section.image && (
                  <ImagePlaceholder
                    label={section.heading}
                    src={section.image}
                    fit={section.imageFit}
                    ratio={section.imageRatio}
                    className={`order-1 min-h-[220px] ${section.imageFirst ? '' : 'lg:order-2'}`}
                  />
                )}
              </div>
              <div className="mx-auto max-w-content px-4 pb-8 sm:px-6">
                <TermsNote>{terms}</TermsNote>
              </div>
            </section>
          )
        })}
      </div>

      <CTASection
        heading={service.closingHeading}
        highlight={service.closingHighlight}
        text={service.closingText}
        buttonLabel={service.closingButtonLabel}
        buttonTo={service.closingButtonTo}
      />
    </>
  )
}

export default ServiceDetail
