import type { ReactNode } from 'react'
import Button from './Button'

interface PageHeroProps {
  eyebrow?: string
  heading: string
  highlight?: string
  subtext: string
  buttonLabel?: string
  buttonTo?: string
  children?: ReactNode
  below?: ReactNode
  video?: string
  image?: string
  imagePosition?: string
  videoClassName?: string
  contentClassName?: string
  scrim?: 'default' | 'soft'
}

function PageHero({
  eyebrow,
  heading,
  highlight,
  subtext,
  buttonLabel = 'Book Now',
  buttonTo = '/book',
  children,
  below,
  video,
  image,
  imagePosition = 'object-center',
  videoClassName = '',
  contentClassName = 'pb-12 sm:pb-16 lg:pb-20',
  scrim = 'default',
}: PageHeroProps) {
  let renderedHeading: ReactNode = heading
  if (highlight && heading.includes(highlight)) {
    const [before, after] = heading.split(highlight)
    renderedHeading = (
      <>
        {before}
        <em className="font-serif italic text-brand-primary">{highlight}</em>
        {after}
      </>
    )
  }

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-neutral-950">
      {video ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover ${videoClassName}`}
          src={video}
          poster={image || '/images/hero.jpg'}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : image ? (
        <img src={image} alt="" className={`absolute inset-0 h-full w-full object-cover brightness-110 ${imagePosition}`} />
      ) : (
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover brightness-110" />
      )}
      <div className={`absolute inset-0 ${scrim === 'soft' ? 'bg-black/10' : 'bg-black/25'}`} />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          scrim === 'soft' ? 'from-black/35 via-black/10 to-transparent' : 'from-black/75 via-black/30 to-black/10'
        }`}
      />

      <div className={`relative z-10 mx-auto w-full max-w-content px-4 pt-32 sm:px-6 ${contentClassName}`}>
        <div className="max-w-2xl text-left">
          {eyebrow && (
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-primary">
              {eyebrow}
            </span>
          )}
          <h1 className="font-serif text-[clamp(2.05rem,1.4rem+2.6vw,3rem)] font-medium leading-[1.1] text-white">
            {renderedHeading}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">{subtext}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button to={buttonTo}>{buttonLabel}</Button>
            {children}
          </div>
          {below && <div className="mt-5">{below}</div>}
        </div>
      </div>
    </section>
  )
}

export default PageHero
