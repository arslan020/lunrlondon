interface SectionHeadingProps {
  eyebrow?: string
  heading: string
  highlight?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
}

function SectionHeading({ eyebrow, heading, highlight, align = 'left', theme = 'dark' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-brand-dark'

  let renderedHeading: React.ReactNode = heading
  if (highlight && heading.includes(highlight)) {
    const [before, after] = heading.split(highlight)
    renderedHeading = (
      <>
        {before}
        <em className="italic text-brand-primary">{highlight}</em>
        {after}
      </>
    )
  }

  return (
    <div className={`max-w-xl ${alignClass}`}>
      {eyebrow && (
        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-primary">
          {eyebrow}
        </span>
      )}
      <h2 className={`font-serif text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-[1.1] ${headingColor}`}>
        {renderedHeading}
      </h2>
    </div>
  )
}

export default SectionHeading
