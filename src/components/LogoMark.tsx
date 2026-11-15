import { useContent } from '../content/ContentProvider'

function LogoMark({ className = '' }: { className?: string }) {
  const { site: siteConfig } = useContent()
  const initials = siteConfig.brandName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className={`flex items-center justify-center w-10 h-10 border-2 border-brand-secondary text-brand-secondary font-serif font-bold text-base ${className}`}
    >
      {initials}
    </span>
  )
}

export default LogoMark
