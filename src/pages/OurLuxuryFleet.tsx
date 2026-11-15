import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import Button from '../components/Button'
import { formatPrice, type VehicleId } from '../data/pricing'
import { useContent } from '../content/ContentProvider'

const cardImagePosition: Record<VehicleId, string> = {
  'e-class': 'object-center',
  'v-class': 'object-center',
  'range-rover': 'object-center',
  's-class': 'object-center',
}

function OurLuxuryFleet() {
  const { fleet, vehicles } = useContent()
  return (
    <>
      <PageHero
        heading={fleet.heading}
        highlight={fleet.highlight}
        subtext={fleet.subtext}
        buttonLabel="Choose Your Vehicle"
        buttonTo="/book"
        image={fleet.image}
        video={fleet.video || undefined}
        imageFit={fleet.video ? 'cover' : 'natural'}
        scrim="soft"
      />

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
        <div className="mx-auto grid max-w-content grid-cols-1 items-stretch gap-5 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-[#141413]">
              <div className="aspect-[3/2] overflow-hidden bg-[#141413]">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className={`h-full w-full object-cover ${cardImagePosition[vehicle.id]}`}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-3xl text-white">{vehicle.shortName}</h3>
                <p className="mt-1 text-sm text-neutral-400">{vehicle.seats}</p>
                <p className="mt-4 font-serif text-4xl text-brand-primary">
                  {formatPrice(vehicle.hourly)}
                  <span className="ml-2 font-sans text-sm font-medium uppercase tracking-wide text-neutral-300">
                    per hour
                  </span>
                </p>
                <Link
                  to="/book"
                  className="mt-5 inline-flex w-fit rounded-full bg-brand-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-primary-contrast"
                >
                  Book Now
                </Link>
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
