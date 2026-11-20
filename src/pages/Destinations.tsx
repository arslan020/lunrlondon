import { useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { useContent } from '../content/ContentProvider'
import {
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
  const { region: regionSlug } = useParams()
  const region = destinationRegions.find((item) => item.slug === regionSlug)

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
          image="/images/airport-hero.jpg"
        />

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <SectionHeading heading="Where the journeys run" highlight="journeys" />
            <p className="mt-6 max-w-3xl leading-relaxed text-neutral-200">
              LUNR is a London chauffeur service. We meet international arrivals at the airport or a London address, and we drive to the UK cities listed here. The car is in London. The fare is confirmed before you travel.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {destinationRegions.map((item) => (
                <Link
                  key={item.slug}
                  to={`/destinations/${item.slug}`}
                  className="rounded-[1rem] bg-[#141413] px-5 py-6 transition hover:bg-[#1c1c1b]"
                >
                  <h3 className="font-serif text-3xl text-white">{item.nav}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300">{item.heading}</p>
                  <p className="mt-4 text-sm font-semibold text-brand-primary">View cities</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-16">
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <SectionHeading heading="Further cities" highlight="Further" />
            <p className="mt-6 max-w-3xl leading-relaxed text-neutral-200">
              Travellers from these cities are met in London as well. The onward journey starts here.
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
      <PageHero eyebrow="Destinations" heading={region.heading} highlight={region.highlight} subtext={region.intro} image={region.image} />

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
              : 'The collection is in London, after the flight or from your address. We do not keep cars in these cities.'}
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
