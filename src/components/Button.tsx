import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'dark'
  type?: 'button' | 'submit'
  className?: string
}

const base =
  'inline-flex items-center justify-center rounded-full px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.08em] shadow-sm transition duration-300 hover:-translate-y-px hover:shadow-md active:translate-y-px active:shadow-none text-center'

const variants: Record<string, string> = {
  primary: 'bg-brand-primary text-brand-primary-contrast',
  outline: 'border border-brand-primary bg-transparent text-brand-primary shadow-none hover:bg-brand-primary hover:text-brand-primary-contrast',
  dark: 'bg-black text-white',
}

function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export default Button
