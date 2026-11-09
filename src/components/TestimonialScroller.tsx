import { testimonials } from '../data/testimonials'
import TestimonialCard from './TestimonialCard'

function Column({ items, duration }: { items: typeof testimonials; duration: string }) {
  const loop = [...items, ...items]
  return (
    <div className="max-h-[560px] overflow-hidden md:max-h-[680px]">
      <div className="marquee-up flex flex-col gap-4" style={{ animationDuration: duration }}>
        {loop.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} index={index} {...item} />
        ))}
      </div>
    </div>
  )
}

function TestimonialScroller() {
  const left = testimonials.filter((_, index) => index % 2 === 0)
  const right = testimonials.filter((_, index) => index % 2 === 1)

  return (
    <>
      <div className="md:hidden">
        <Column items={testimonials} duration="55s" />
      </div>
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        <Column items={left} duration="42s" />
        <Column items={right} duration="54s" />
      </div>
    </>
  )
}

export default TestimonialScroller
