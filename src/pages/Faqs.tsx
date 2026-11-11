import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import ImagePlaceholder from '../components/ImagePlaceholder'
import FaqAccordion from '../components/FaqAccordion'
import CTASection from '../components/CTASection'
import { faqGroups } from '../data/faqs'

function Faqs() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        heading="Frequently Asked Questions"
        subtext="Everything you need to know about booking, pricing, our chauffeurs, and our vehicles."
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading heading="Everything You Need to Know" />
            <p className="mt-6 leading-relaxed text-neutral-200">
              Below you will find answers to the questions we are asked most often. If you can't
              find what you're looking for, our team is happy to help directly.
            </p>
            <div className="mt-8">
              <Link to="/contact" className="text-sm font-semibold text-brand-primary underline">
                Contact Our Team Today
              </Link>
            </div>
          </div>
          <ImagePlaceholder label="Range Rover" src="/images/rr-parklane.jpg" className="min-h-[220px]" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <FaqAccordion groups={faqGroups} />
        </div>
      </section>

      <CTASection
        heading="Still Have a Question?"
        text="Speak to our team today and we will be happy to help."
        buttonLabel="Speak To Our Team Today"
        buttonTo="/contact"
      />
    </>
  )
}

export default Faqs
