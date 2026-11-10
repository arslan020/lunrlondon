import ImagePlaceholder from '../components/ImagePlaceholder'
import SectionHeading from '../components/SectionHeading'
import ServicesCarousel from '../components/ServicesCarousel'
import TestimonialScroller from '../components/TestimonialScroller'
import PageHero from '../components/PageHero'
import GoldCtaBar from '../components/GoldCtaBar'
import CTASection from '../components/CTASection'
import Button from '../components/Button'
import { siteConfig } from '../siteConfig'

function Home() {
  return (
    <div className="bg-black">
      <PageHero
        heading="Luxury Chauffeur Service in London & Across the UK"
        highlight="Luxury"
        subtext={`${siteConfig.brandName} provides a luxury chauffeur service for clients who expect precision, discretion, and professionalism as standard. Serving business leaders, private individuals, and specialist clients, we deliver refined chauffeured travel designed around comfort, reliability, and peace of mind.`}
        video="/videos/hero.mp4"
        image="/images/hero.jpg"
        videoClassName="brightness-[1.18]"
        scrim="soft"
      />

      <section className="bg-black py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <ServicesCarousel />
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <h2 className="font-serif text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-tight text-white">
            A <em className="italic text-brand-primary">Luxury</em> Experience Without Compromise
          </h2>
          <div>
            <p className="leading-relaxed text-neutral-200">
              Luxury is found in the details. At {siteConfig.brandName}, our Luxury Chauffeur Service is
              built around creating a calm, comfortable, and effortless experience for every client. Our
              vehicles are meticulously prepared before every journey, ensuring a pristine environment
              that reflects the expectations of our clientele. Inside, comfort and refinement take
              priority. Outside, discretion and professionalism define our presence. This is chauffeuring
              designed to feel seamless, not intrusive.
            </p>
            <p className="mt-5 leading-relaxed text-neutral-200">
              For clients who value privacy, consistency, and attention to detail, our Luxury Chauffeur
              Service delivers an experience that feels considered from start to finish.
            </p>
            <div className="mt-8">
              <Button to="/contact">Enquire Today</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="py-4 md:py-6">
        <GoldCtaBar text="Contact us today to discuss your travel needs or request a quotation." />
      </div>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading heading="Reliability You Can Trust" highlight="Reliability" theme="dark" />
            <p className="mt-6 leading-relaxed text-neutral-200">
              Time matters. Whether arriving for a meeting, boarding a flight, or attending a private
              engagement, reliability is fundamental to our Luxury Chauffeur Service.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-200">
              Our chauffeurs operate with precision, planning routes carefully and monitoring conditions
              to ensure punctual arrivals. For airport journeys, live flight tracking allows us to adapt
              seamlessly to delays or early arrivals, removing stress from your travel plans.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-200">
              This commitment to reliability ensures clients can travel with confidence, knowing their
              chauffeur will be ready exactly when required.
            </p>
            <div className="mt-8">
              <Button to="/book">Book With Confidence</Button>
            </div>
          </div>
          <ImagePlaceholder label="Range Rover" src="/images/range-rover-city.jpg" className="min-h-[240px]" />
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <ImagePlaceholder
            label="Range Rover"
            src="/images/range-rover-classic.jpg"
            className="order-1 min-h-[240px] lg:order-1"
          />
          <div className="order-2">
            <SectionHeading heading="Professional Chauffeurs You Can Rely On" highlight="Chauffeurs" theme="dark" />
            <p className="mt-6 leading-relaxed text-neutral-200">
              Every chauffeur representing {siteConfig.brandName} is carefully selected, fully licensed,
              and professionally trained. Our Luxury Chauffeur Service is delivered by individuals who
              understand the importance of discretion, presentation, and client care.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-200">
              Professionalism extends beyond driving. It is reflected in communication, personal conduct,
              and the ability to adapt to each client&rsquo;s expectations. For specialist requirements,
              including close protection travel, chauffeurs may hold additional certifications and
              training. The result is a service that feels calm, capable, and consistently professional.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,1.4rem+2vw,2.8rem)] font-medium leading-tight text-white">
              What Our <em className="italic text-brand-primary">Clients</em> Say
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-200">
              From airport transfers to special occasions, our clients trust us for a smooth, professional
              service every step of the way.
            </p>
            <Button href={siteConfig.googleReviewsUrl} className="mt-7">
              Check Out Our Google Reviews
            </Button>
          </div>
          <div className="lg:col-span-2">
            <TestimonialScroller />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-tight text-white">
              A Fleet <em className="italic text-brand-primary">Designed</em> for Comfort &amp; Flexibility
            </h2>
            <p className="mt-6 leading-relaxed text-neutral-200">
              Our Luxury Chauffeur Service is supported by a carefully curated fleet of high-end vehicles.
              From executive cars to larger group transport, including 16-seater vehicles, we provide
              solutions for both individual and group travel. All vehicles are:
            </p>
            <ul className="mt-5 space-y-2 text-sm text-neutral-300">
              {[
                'Immaculately cleaned before every journey',
                'Regularly maintained and safety checked',
                'Driven by licensed professional chauffeurs',
              ].map((item) => (
                <li key={item} className="relative pl-6">
                  <span className="absolute left-0 top-[0.45em] h-2 w-2 rounded-[2px] bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-neutral-200">
              Child and baby seats are available on request and must be arranged in advance.
            </p>
          </div>
          <ImagePlaceholder label="Range Rover" src="/images/range-rover-vogue.jpg" className="min-h-[240px]" />
        </div>
      </section>

      <CTASection
        heading={`Contact ${siteConfig.brandName}`}
        text="Whether you are planning a single journey or require an ongoing chauffeur solution, we are ready to assist. Our team is available to discuss your requirements, provide accurate quotations, and ensure your journey is handled with the professionalism you expect from a Luxury Chauffeur Service. Contact us today to discuss your travel needs or request a quotation."
        buttonLabel="Contact Us"
        buttonTo="/contact"
      />
    </div>
  )
}

export default Home
