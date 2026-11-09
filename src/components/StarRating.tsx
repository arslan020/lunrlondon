function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-brand-secondary" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
