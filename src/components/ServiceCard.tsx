import { Link } from 'react-router-dom'

interface ServiceCardProps {
  slug: string
  title: string
  image?: string
}

function ServiceCard({ slug, title, image }: ServiceCardProps) {
  return (
    <Link
      to={`/chauffeur-services/${slug}`}
      className="group relative block aspect-square w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[1rem] bg-neutral-800 sm:w-[300px] lg:w-[320px]"
    >
      {image ? (
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-serif text-[1.7rem] font-medium leading-none text-white">{title}</h3>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-white">
          Find Out More
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M9 3l5 5-5 5-1.4-1.4L10.2 9H2V7h8.2L7.6 4.4z" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default ServiceCard
