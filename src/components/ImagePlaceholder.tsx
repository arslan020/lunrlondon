interface ImagePlaceholderProps {
  label?: string
  className?: string
  ratio?: string
  tone?: 'light' | 'dark'
  src?: string
  fit?: 'cover' | 'contain'
}

const tones: Record<string, string> = {
  light: 'bg-neutral-200 text-neutral-500 border border-neutral-300',
  dark: 'bg-neutral-900 text-neutral-600 border border-neutral-800',
}

function ImagePlaceholder({
  label = 'Image',
  className = '',
  ratio = 'aspect-[4/3]',
  tone = 'dark',
  src,
  fit = 'cover',
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div className={`${ratio} overflow-hidden rounded-[1rem] bg-neutral-900 ${className}`}>
        <img src={src} alt={label} className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
      </div>
    )
  }

  return (
    <div
      className={`${ratio} ${tones[tone]} ${className} flex items-center justify-center rounded-[1rem] text-xs font-medium uppercase tracking-wide`}
    >
      {label}
    </div>
  )
}

export default ImagePlaceholder
