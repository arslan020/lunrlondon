import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import ImagePlaceholder from '../components/ImagePlaceholder'
import FaqAccordion from '../components/FaqAccordion'
import CTASection from '../components/CTASection'
import { useContent } from '../content/ContentProvider'

function Faqs() {
  const { faqsPage, faqs } = useContent()
  return (
    <>
      <PageHero eyebrow={faqsPage.eyebrow} heading={faqsPage.heading} subtext={faqsPage.subtext} />

      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading heading={faqsPage.sectionHeading} />
            <p className="mt-6 leading-relaxed text-neutral-200">{faqsPage.sectionText}</p>
            <div className="mt-8">
              <Link to="/contact" className="text-sm font-semibold text-brand-primary underline">
                Contact Our Team Today
              </Link>
            </div>
          </div>
          <ImagePlaceholder label="Range Rover" src={faqsPage.image} fit="natural" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <FaqAccordion groups={faqs} />
        </div>
      </section>

      <CTASection heading={faqsPage.closingHeading} text={faqsPage.closingText} buttonLabel="Speak To Our Team Today" buttonTo="/contact" />
    </>
  )
}

export default Faqs
