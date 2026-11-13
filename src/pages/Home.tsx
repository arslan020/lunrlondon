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
        heading="A Higher Standard of Chauffeuring. Around the Clock."
        highlight="Around the Clock"
        subtext="From sunrise to moonlight, experience chauffeur services where excellence has no closing hours."
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
            Luxury Never <em className="italic text-brand-primary">Sleeps</em>
          </h2>
          <div>
            <p className="leading-relaxed text-neutral-200">
              At {siteConfig.brandName}, we believe true luxury is not simply about where you travel, but
              how you are treated along the way.
            </p>
            <p className="mt-5 leading-relaxed text-neutral-200">
              Every journey is an opportunity to demonstrate our commitment to trust, reliability, respect
              and honour. From the moment you make your booking to the moment you reach your destination,
              we place your comfort, time and confidence at the heart of everything we do.
            </p>
            <p className="mt-5 leading-relaxed text-neutral-200">
              Whether travelling for business, leisure or a special occasion, our approach remains
              unchanged: professional service, considered attention and an unwavering commitment to the
              highest standards.
            </p>
            <p className="mt-5 leading-relaxed text-neutral-200">
              Available 24 hours a day, 7 days a week, we move with the rhythm of your world.
            </p>
            <p className="mt-5 font-serif text-xl text-brand-primary">{siteConfig.brandName}. Luxury Never Sleeps.</p>
            <div className="mt-8">
              <Button to="/contact">Enquire Today</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="py-4 md:py-6">
        <GoldCtaBar text="From sunrise to moonlight. We know luxury never sleeps." />
      </div>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading heading="Trust Is Our Foundation" highlight="Trust" theme="dark" />
            <p className="mt-6 leading-relaxed text-neutral-200">
              Confidence is earned, never assumed. We understand the responsibility entrusted to us with
              every booking and approach every journey with integrity, honesty and accountability.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-200">
              Reliability is our promise. Your time matters. We place punctuality, preparation and
              consistency at the centre of our service, ensuring every journey receives the attention it
              deserves.
            </p>
            <div className="mt-8">
              <Button to="/book">Book With Confidence</Button>
            </div>
          </div>
          <ImagePlaceholder label="Range Rover" src="/images/rr-country.jpg" className="min-h-[240px]" />
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <ImagePlaceholder
            label="Range Rover"
            src="/images/rr-manor-side.jpg"
            className="order-1 min-h-[240px] lg:order-1"
          />
          <div className="order-2">
            <SectionHeading heading="Respect Is Our Standard" highlight="Respect" theme="dark" />
            <p className="mt-6 leading-relaxed text-neutral-200">
              Every client, every occasion and every destination deserves consideration. We believe in
              professionalism without exception, discretion without compromise and service without
              assumption.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-200">
              Honour is our principle. We stand by our commitments. Our word carries meaning, our conduct
              reflects our values, and our responsibility extends beyond simply getting you to your
              destination.
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
              The {siteConfig.brandName} fleet is the Mercedes-Benz E-Class, V-Class and S-Class, and the
              Range Rover. All vehicles are:
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
          <ImagePlaceholder label="Range Rover" src="/images/rr-manor-wide.jpg" className="min-h-[240px]" />
        </div>
      </section>

      <CTASection
        heading="Whenever the World Calls, LUNR Is Ready."
        text="From the earliest departure to the latest arrival, experience a service designed around your schedule, your expectations and your peace of mind. Day or night. Every journey. One standard."
        buttonLabel="Contact Us"
        buttonTo="/contact"
      />
    </div>
  )
}

export default Home
