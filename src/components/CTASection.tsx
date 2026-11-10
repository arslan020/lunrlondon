import Button from './Button'
import UKMapGraphic from './UKMapGraphic'

interface CTASectionProps {
  heading: string
  highlight?: string
  text: string
  buttonLabel: string
  buttonTo?: string
}

function CTASection({ heading, highlight, text, buttonLabel, buttonTo = '/contact' }: CTASectionProps) {
  let renderedHeading: React.ReactNode = heading
  if (highlight && heading.includes(highlight)) {
    const [before, after] = heading.split(highlight)
    renderedHeading = (
      <>
        {before}
        <em className="italic">{highlight}</em>
        {after}
      </>
    )
  }
  return (
    <section className="no-reveal py-10 md:py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1rem] bg-brand-secondary px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <UKMapGraphic className="pointer-events-none absolute right-2 top-1/2 h-[108%] w-auto max-w-[64%] -translate-y-1/2 object-contain sm:right-6 sm:h-[130%] sm:max-w-[58%]" />
          <div className="relative max-w-xl">
            <h2 className="font-serif text-[clamp(2rem,1.4rem+2vw,3rem)] font-medium leading-tight text-brand-dark">
              {renderedHeading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-dark/90 sm:text-base">{text}</p>
            <div className="mt-7">
              <Button to={buttonTo} variant="dark">
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
