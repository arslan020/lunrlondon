import PageHero from '../components/PageHero'
import ServicesCarousel from '../components/ServicesCarousel'
import { useContent } from '../content/ContentProvider'

function ChauffeurServices() {
  const { servicesPage } = useContent()
  return (
    <>
      <PageHero
        heading={servicesPage.heading}
        highlight={servicesPage.highlight}
        subtext={servicesPage.subtext}
      />

      <section className="bg-black py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          {servicesPage.paragraphs.filter((paragraph) => paragraph.trim()).map((paragraph) => (
            <p key={paragraph} className="mt-5 leading-relaxed text-neutral-200 first:mt-0">
              {paragraph}
            </p>
          ))}
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
