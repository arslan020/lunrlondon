import { useRef } from 'react'
import ServiceCard from './ServiceCard'
import { services } from '../data/services'

function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('a')
    const amount = card ? card.getBoundingClientRect().width + 16 : 320
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const arrows = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous service"
        onClick={() => scroll('left')}
        className="flex h-11 w-11 items-center justify-center text-white hover:text-brand-primary"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M15.4 4.6 8 12l7.4 7.4-1.4 1.4L5.2 12 14 3.2z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next service"
        onClick={() => scroll('right')}
        className="flex h-11 w-11 items-center justify-center text-white hover:text-brand-primary"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="m8.6 4.6 1.4-1.4L18.8 12 10 20.8l-1.4-1.4L16 12z" />
        </svg>
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex justify-end md:hidden">{arrows}</div>
      <div
        ref={trackRef}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.slug}
            slug={service.slug}
            title={service.navLabel}
            image={service.cardImage ?? service.heroImage}
            contain={service.slug === 'as-directed'}
            imagePosition={service.slug === 'one-way-transfer' ? 'object-[center_72%]' : 'object-center'}
          />
        ))}
      </div>
      <div className="hidden shrink-0 md:flex">{arrows}</div>
    </div>
  )
}

export default ServicesCarousel
