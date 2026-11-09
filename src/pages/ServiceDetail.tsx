import { Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import ImagePlaceholder from '../components/ImagePlaceholder'
import CTASection from '../components/CTASection'
import GoldCtaBar from '../components/GoldCtaBar'
import Button from '../components/Button'
import UKMapGraphic from '../components/UKMapGraphic'
import { getServiceBySlug } from '../data/services'
import type { ServiceFeatureSection } from '../types'

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

function GoldPanel({ section }: { section: ServiceFeatureSection }) {
  return (
    <section className="py-6 md:py-8">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1rem] bg-brand-secondary px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <UKMapGraphic className="pointer-events-none absolute -right-8 top-1/2 hidden h-[130%] w-auto max-w-[58%] -translate-y-1/2 object-contain sm:block" />
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
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getServiceBySlug(slug) : undefined

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
              </section>
            )
          }

          if (section.layout === 'gold') {
            return <GoldPanel key={section.heading} section={section} />
          }

          return (
            <section key={section.heading}>
              <div className="mx-auto grid max-w-content items-center gap-8 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-12">
                <div className={section.imageFirst ? 'order-2' : 'order-2 lg:order-1'}>
                  <SectionHeading heading={section.heading} highlight={section.highlight} />
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-5 leading-relaxed text-neutral-200">
                      {paragraph}
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
                <ImagePlaceholder
                  label={section.heading}
                  src={section.image}
                  className={`order-1 min-h-[220px] ${section.imageFirst ? '' : 'lg:order-2'}`}
                />
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
