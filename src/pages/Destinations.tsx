import { useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { useContent } from '../content/ContentProvider'
import {
  destinationHero,
  destinationRegions,
  furtherDestinations,
  globalDestinationDescription,
  globalDestinationTitle,
} from '../data/destinations'
import NotFound from './NotFound'

function usePageMeta(title: string, description: string) {
  const { site } = useContent()

  useLayoutEffect(() => {
    if (!title) return
    const root = document.documentElement
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    root.dataset.pageTitle = title
    document.title = title
    meta?.setAttribute('content', description)
    return () => {
      delete root.dataset.pageTitle
      document.title = `${site.brandName} | ${site.tagline}`
      meta?.setAttribute('content', previousDescription)
    }
  }, [title, description, site.brandName, site.tagline])
}

function CityList({ cities }: { cities: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {cities.map((city) => (
        <li key={city} className="rounded-[1rem] bg-[#141413] px-4 py-5">
          <h3 className="font-serif text-2xl leading-tight text-white">{city}</h3>
        </li>
      ))}
    </ul>
  )
}

function Destinations() {
  const content = useContent()
  const { region: regionSlug } = useParams()
  const region = destinationRegions.find((item) => item.slug === regionSlug)
  const heroImage = destinationHero(content, region?.slug)

  usePageMeta(
    region ? region.title : regionSlug ? '' : globalDestinationTitle,
    region ? region.description : regionSlug ? '' : globalDestinationDescription,
  )

  if (regionSlug && !region) return <NotFound />

  if (!region) {
    return (
      <>
        <PageHero
          eyebrow="Destinations"
          heading="Luxury London chauffeur services for international travellers"
          highlight="international travellers"
          subtext="A car in London for arrivals from abroad, and for the drive on to cities across the UK."
          image={heroImage}
        />

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <SectionHeading heading="Where the journeys run" highlight="journeys" />
            <p className="mt-6 max-w-3xl leading-relaxed text-neutral-200">
              LUNR meets international arrivals at the airport or their address. The car takes them to London or anywhere in the UK. The fare is confirmed before you travel.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {destinationRegions.map((item) => {
                const image = destinationHero(content, item.slug)
                return (
                  <Link
                    key={item.slug}
                    to={`/destinations/${item.slug}`}
                    className="relative flex min-h-[11.5rem] flex-col justify-end overflow-hidden rounded-[1rem] bg-[#141413]"
                  >
                    {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />
                    <div className="relative z-10 px-5 py-5">
                      <h3 className="font-serif text-3xl text-white">{item.nav}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-200">{item.heading}</p>
                      <p className="mt-4 text-sm font-semibold text-brand-primary">View cities</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-16">
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <SectionHeading heading="Further cities" highlight="Further" />
            <p className="mt-6 max-w-3xl leading-relaxed text-neutral-200">
              Travellers from these cities are met when they land. The car takes them to London or anywhere in the UK.
            </p>
            <div className="mt-8">
              <CityList cities={furtherDestinations} />
            </div>
            <p className="mt-10 max-w-3xl leading-relaxed text-neutral-200">
              Airport arrivals use the fixed fares on the airport transfer page. Heathrow, Gatwick, London City, Luton, Stansted and Farnborough are all covered.
            </p>
            <Link to="/chauffeur-services/airport-transfer" className="mt-4 inline-block text-sm font-semibold text-brand-primary underline">
              International airport transfers
            </Link>
          </div>
        </section>

        <CTASection
          heading="Tell us the city and the landing time."
          text="Share where you are flying from and where the car should go. We confirm the fare before you travel."
          buttonLabel="Book Now"
          buttonTo="/book"
        />
      </>
    )
  }

  return (
    <>
      <PageHero eyebrow="Destinations" heading={region.heading} highlight={region.highlight} subtext={region.intro} image={heroImage} />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Link to="/destinations" className="text-sm font-semibold text-brand-primary underline">
            All destinations
          </Link>
          <div className="mt-8">
            <CityList cities={region.cities} />
          </div>
          <p className="mt-10 max-w-3xl leading-relaxed text-neutral-200">
            {region.slug === 'united-kingdom'
              ? 'These journeys are driven from London. Hourly hire covers the day, and a one-way transfer is priced from the route.'
              : 'We collect you after the flight, or from your address, and take you to London or anywhere in the UK. We do not keep cars in these cities.'}
          </p>
          <Link to="/chauffeur-services/airport-transfer" className="mt-4 inline-block text-sm font-semibold text-brand-primary underline">
            International airport transfers
          </Link>
        </div>
      </section>

      <CTASection
        heading="Tell us the city and the landing time."
        text="Share where you are flying from and where the car should go. We confirm the fare before you travel."
        buttonLabel="Book Now"
        buttonTo="/book"
      />
    </>
  )
}

export default Destinations
