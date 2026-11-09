import type { Testimonial } from '../types'
import StarRating from './StarRating'

const avatarColors = ['bg-amber-600', 'bg-sky-700', 'bg-emerald-700', 'bg-violet-700', 'bg-orange-700', 'bg-cyan-700', 'bg-rose-700', 'bg-indigo-700']

function TestimonialCard({ name, quote, index = 0 }: Testimonial & { index?: number }) {
  return (
    <article className="rounded-[1rem] bg-[#1a1a19] p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold uppercase text-white ${avatarColors[index % avatarColors.length]}`}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold uppercase tracking-wide text-white">{name}</span>
          <StarRating />
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">{quote}</p>
    </article>
  )
}

export default TestimonialCard
