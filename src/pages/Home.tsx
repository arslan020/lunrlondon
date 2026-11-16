import ImagePlaceholder from '../components/ImagePlaceholder'
import ServicesCarousel from '../components/ServicesCarousel'
import TestimonialScroller from '../components/TestimonialScroller'
import PageHero from '../components/PageHero'
import GoldCtaBar from '../components/GoldCtaBar'
import CTASection from '../components/CTASection'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import { useContent } from '../content/ContentProvider'

function goldHeading(heading: string, highlight: string) {
  if (!highlight || !heading.includes(highlight)) return heading
  const [before, after] = heading.split(highlight)
  return (
    <>
      {before}
      <em className="italic text-brand-primary">{highlight}</em>
      {after}
    </>
  )
}

function Home() {
  const { home, site } = useContent()
  const paragraphs = home.luxuryParagraphs.filter((paragraph) => paragraph.trim())

  return (
    <div className="bg-black">
      <PageHero
        heading={home.heroHeading}
        highlight={home.heroHighlight}
        subtext={home.heroSubtext}
        video={home.heroVideo || undefined}
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
            {goldHeading(home.luxuryHeading, home.luxuryHighlight)}
          </h2>
          <div>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 leading-relaxed text-neutral-200 first:mt-0">
                {paragraph}
              </p>
            ))}
            <p className="mt-5 font-serif text-xl text-brand-primary">{home.luxurySignoff}</p>
            <div className="mt-8">
              <Button to="/contact">Enquire Today</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="py-4 md:py-6">
        <GoldCtaBar text={home.goldBar} />
      </div>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <SectionHeading heading={home.trustHeading} highlight={home.trustHighlight} theme="dark" />
            {home.trustParagraphs.filter((paragraph) => paragraph.trim()).map((paragraph) => (
              <p key={paragraph} className="mt-6 leading-relaxed text-neutral-200 first:mt-6">
                {paragraph}
              </p>
            ))}
            <h3 className="mt-6 font-serif text-2xl italic text-brand-primary">{home.trustTimeHeading}</h3>
            <p className="mt-3 leading-relaxed text-neutral-200">{home.trustTimeText}</p>
            <h3 className="mt-6 font-serif text-2xl italic text-brand-primary">{home.trustDiscretionHeading}</h3>
            <p className="mt-3 leading-relaxed text-neutral-200">{home.trustDiscretionText}</p>
            <div className="mt-8">
              <Button to="/book">Book With Confidence</Button>
            </div>
          </div>
          <ImagePlaceholder label={home.trustImageLabel} src={home.trustImage} className="order-1 min-h-[240px] lg:order-2" />
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="order-1 lg:order-2">
            <SectionHeading heading={home.respectHeading} highlight={home.respectHighlight} theme="dark" />
            {home.respectParagraphs.filter((paragraph) => paragraph.trim()).map((paragraph) => (
              <p key={paragraph} className="mt-6 leading-relaxed text-neutral-200">
                {paragraph}
              </p>
            ))}
          </div>
          <ImagePlaceholder label="Range Rover" src={home.respectImage} className="order-2 min-h-[240px] lg:order-1" />
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,1.4rem+2vw,2.8rem)] font-medium leading-tight text-white">
              {goldHeading(home.reviewsHeading, home.reviewsHighlight)}
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-200">{home.reviewsText}</p>
            <Button href={site.googleReviewsUrl} className="mt-7">
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
              {goldHeading(home.fleetHeading, home.fleetHighlight)}
            </h2>
            <p className="mt-6 leading-relaxed text-neutral-200">{home.fleetText}</p>
            <ul className="mt-5 space-y-2 text-sm text-neutral-300">
              {home.fleetBullets.filter((item) => item.trim()).map((item) => (
                <li key={item} className="relative pl-6">
                  <span className="absolute left-0 top-[0.45em] h-2 w-2 rounded-[2px] bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-neutral-200">{home.fleetNote}</p>
          </div>
          <ImagePlaceholder label="Range Rover" src={home.fleetImage} className="min-h-[240px]" />
        </div>
      </section>

      <CTASection heading={home.closingHeading} text={home.closingText} buttonLabel="Contact Us" buttonTo="/contact" />
    </div>
  )
}

export default Home
