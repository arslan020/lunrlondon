import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import Button from '../components/Button'
import TermsNote from '../components/TermsNote'
import { formatPrice, hourlyTerms, vehicleTitle, type VehicleId } from '../data/pricing'
import { useContent } from '../content/ContentProvider'

const cardImagePosition: Record<VehicleId, string> = {
  'e-class': 'object-center',
  'v-class': 'object-center',
  'range-rover': 'object-center',
  's-class': 'object-center',
  '5-series': 'object-center',
}

function OurLuxuryFleet() {
  const { fleet, vehicles, minimumHours } = useContent()
  const heading = fleet.heading
  const highlight = fleet.highlight
  const renderedHeading =
    highlight && heading.includes(highlight) ? (
      <>
        {heading.split(highlight)[0]}
        <em className="font-serif italic text-brand-primary">{highlight}</em>
        {heading.split(highlight)[1]}
      </>
    ) : (
      heading
    )

  return (
    <>
      <section className="relative bg-[#080808]">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/lunr-fleet-mobile.jpg" />
          <img
            src="/images/lunr-fleet-hero.jpg"
            alt="LUNR luxury chauffeur fleet"
            className="block h-auto w-full object-contain"
          />
        </picture>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent">
          <div className="mx-auto max-w-content px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
            <h1 className="max-w-2xl font-serif text-[clamp(2.05rem,1.4rem+2.6vw,3rem)] font-medium leading-[1.1] text-white">
              {renderedHeading}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">{fleet.subtext}</p>
            <div className="mt-7">
              <Button to="/book">Choose Your Vehicle</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionHeading heading={fleet.introHeading} align="center" />
          <p className="mt-6 leading-relaxed text-neutral-200">{fleet.introText}</p>
          <div className="mt-8">
            <Button to="/contact" variant="outline">
              Contact Us For A Recommendation
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-20">
        <div className="mx-auto grid max-w-content grid-cols-1 items-stretch gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-[#141413]">
              <div className="aspect-[3/2] overflow-hidden bg-[#141413]">
                {vehicle.image && (
                  <img
                    src={vehicle.image}
                    alt={vehicleTitle(vehicle)}
                    className={`h-full w-full object-cover ${cardImagePosition[vehicle.id]}`}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-3xl leading-tight text-white">{vehicleTitle(vehicle)}</h3>
                <p className="mt-1 text-sm text-neutral-400">{vehicle.seats}</p>
                {vehicle.hourly > 0 && (
                  <p className="mt-4 font-serif text-4xl text-brand-primary">
                    {formatPrice(vehicle.hourly)}
                    <span className="ml-2 font-sans text-sm font-medium uppercase tracking-wide text-neutral-300">
                      per hour
                    </span>
                  </p>
                )}
                <Link
                  to="/book"
                  className="mt-5 inline-flex w-fit rounded-full bg-brand-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-primary-contrast"
                >
                  Book Now
                </Link>
                {vehicle.hourly > 0 && (
                  <div className="mt-4">
                    <TermsNote>{hourlyTerms(minimumHours)}</TermsNote>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        heading={fleet.closingHeading}
        text={fleet.closingText}
        buttonLabel="Contact Us"
        buttonTo="/contact"
      />
    </>
  )
}

export default OurLuxuryFleet
