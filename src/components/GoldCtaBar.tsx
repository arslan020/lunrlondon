import Button from './Button'

interface GoldCtaBarProps {
  text: string
  buttonLabel?: string
  buttonTo?: string
  pinButton?: boolean
}

function GoldCtaBar({ text, buttonLabel = 'Contact Us', buttonTo = '/contact', pinButton = false }: GoldCtaBarProps) {
  return (
    <div className="no-reveal mx-auto max-w-content px-4 sm:px-6">
      <div
        className={`flex flex-col items-center rounded-[1rem] bg-brand-secondary px-5 sm:flex-row sm:justify-between sm:px-8 sm:py-7 lg:px-10 ${
          pinButton ? 'min-h-64 justify-between py-6 sm:min-h-0' : 'justify-between gap-5 py-6'
        }`}
      >
        <p className="text-center font-serif text-[clamp(1.25rem,1rem+1vw,1.7rem)] leading-snug text-brand-dark sm:text-left">
          {text}
        </p>
        <Button to={buttonTo} variant="dark" className="shrink-0">
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

export default GoldCtaBar
