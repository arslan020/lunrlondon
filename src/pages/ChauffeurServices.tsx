import PageHero from '../components/PageHero'
import ServicesCarousel from '../components/ServicesCarousel'
import { siteConfig } from '../siteConfig'

function ChauffeurServices() {
  return (
    <>
      <PageHero
        heading="Every Journey. Considered. Every Detail. Delivered."
        highlight="Considered"
        subtext="A tailored collection of chauffeur services, available around the clock, designed around the way you travel."
      />

      <section className="bg-black py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="leading-relaxed text-neutral-200">
            No two journeys are the same. Whether you require a direct transfer, a dedicated chauffeur by
            the hour, seamless airport transportation or a more security-conscious travel arrangement,{' '}
            {siteConfig.brandName} provides a considered approach to every booking.
          </p>
          <p className="mt-5 leading-relaxed text-neutral-200">
            Our services are built around flexibility, professionalism and the understanding that
            exceptional service begins long before the journey itself.
          </p>
          <p className="mt-5 leading-relaxed text-neutral-200">Whatever the destination, our standards remain constant.</p>
        </div>
      </section>

      <section className="bg-black pb-12 md:pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <ServicesCarousel />
        </div>
      </section>
    </>
  )
}

export default ChauffeurServices
