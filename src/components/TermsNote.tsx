function TermsNote({ children, tone = 'light' }: { children: string; tone?: 'light' | 'dark' }) {
  return (
    <p className={`text-xs leading-relaxed ${tone === 'dark' ? 'text-brand-dark/70' : 'text-neutral-400'}`}>
      <span className={`mr-1 ${tone === 'dark' ? 'text-brand-dark' : 'text-brand-primary'}`} aria-hidden="true">
        *
      </span>
      {children}
    </p>
  )
}

export default TermsNote
