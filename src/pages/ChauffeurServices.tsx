import PageHero from '../components/PageHero'
import ServicesCarousel from '../components/ServicesCarousel'
import { siteConfig } from '../siteConfig'

function ChauffeurServices() {
  return (
    <>
      <PageHero
        heading="Chauffeur Services in London & Across the UK"
        highlight="Luxury"
        subtext={`${siteConfig.brandName} provides a luxury chauffeur service for clients who expect precision, discretion, and professionalism as standard.`}
      />

      <section className="bg-black py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <ServicesCarousel />
        </div>
      </section>
    </>
  )
}

export default ChauffeurServices
