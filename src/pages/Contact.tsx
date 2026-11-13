import { useMemo, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { faqGroups } from '../data/faqs'
import { sendEnquiry } from '../lib/sendEnquiry'
import { siteConfig } from '../siteConfig'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none placeholder:text-neutral-500 transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/35 hover:bg-white/10 focus:border-white/45 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]'

function digits(value: string) {
  return value.replace(/[^\d+]/g, '')
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const moveGlow = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--contact-pointer-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--contact-pointer-y', `${event.clientY - rect.top}px`)
    card.style.setProperty('--contact-pointer-active', '1')
  }

  const hideGlow = () => {
    cardRef.current?.style.setProperty('--contact-pointer-active', '0')
  }

  const phone = siteConfig.phone || siteConfig.mobile
  const whatsappHref = phone ? `https://wa.me/${digits(phone).replace(/^\+/, '')}` : ''
  const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : ''
  const address = [siteConfig.address.line1, siteConfig.address.line2].filter(Boolean).join(', ')

  const channels = [
    { label: 'WhatsApp', detail: phone ? 'Message the team' : 'Number coming soon', href: whatsappHref, icon: 'whatsapp' as const },
    { label: 'Email', detail: siteConfig.email || 'Email coming soon', href: emailHref, icon: 'email' as const },
  ]
  const mapsHref = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : ''

  const groups = ['All', ...faqGroups.map((item) => item.groupTitle)]

  const questions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return faqGroups.flatMap((item) =>
      item.groupTitle === group || group === 'All'
        ? item.items
            .filter((faq) => !needle || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle))
            .map((faq) => ({ ...faq, groupTitle: item.groupTitle }))
        : [],
    )
  }, [group, query])

  const visible = showAll ? questions : questions.slice(0, 4)

  const openEnquiry = () => {
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setSending(true)
    setError('')
    try {
      await sendEnquiry({
        kind: 'contact',
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        message: String(data.get('message') ?? ''),
        website: String(data.get('website') ?? ''),
      })
      setSubmitted(true)
    } catch {
      setError('We could not send that just now. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-black text-white">
      <section className="px-4 pb-4 pt-28 sm:px-6">
        <div className="mx-auto max-w-content text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Get in touch</p>
          <h1 className="mx-auto mt-4 max-w-[14ch] text-[2.35rem] font-medium leading-[1.08] tracking-tight text-white sm:text-6xl">
            Someone here when the journey needs a person.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-300 sm:text-base">
            Speak with {siteConfig.brandName} about a new journey, a change to a booking, or a plan that needs more than a form.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-950"
            >
              Book a journey
              <Arrow />
            </Link>
            <button
              type="button"
              onClick={openEnquiry}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
            >
              Send an enquiry
              <Arrow />
            </button>
          </div>
          <img
            src="/images/chauffeur.jpg"
            alt=""
            className="mt-10 h-56 w-full rounded-2xl object-cover object-[center_30%] sm:h-[420px]"
          />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-content">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-500">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="px-2">›</span>
            <span className="text-neutral-300">Contact</span>
          </nav>

          <div
            id="enquiry"
            ref={cardRef}
            onPointerMove={moveGlow}
            onPointerLeave={hideGlow}
            className="contact-card relative scroll-mt-28 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#111111] p-5 sm:p-8 lg:p-10"
          >
            <div className="relative z-[1] grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Get in touch</p>
                <h2 className="mt-3 text-[1.85rem] font-semibold uppercase leading-[1.02] tracking-tight sm:text-[2.6rem]">
                  Talk to a person, any hour.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300">
                  See a fare online, and reach the team when you want to talk the journey through. We accept cryptocurrency.
                </p>
                <Link to="/book" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">
                  Book now / Get quote
                  <span aria-hidden="true">›</span>
                </Link>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {channels.map((channel) => {
                    const row = (
                      <>
                        <ChannelIcon name={channel.icon} large />
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{channel.label}</span>
                        <span className="block break-words text-xs text-neutral-400">
                          {channel.label === 'Email' ? channel.detail.replace('@', '@\u200b') : channel.detail}
                        </span>
                      </>
                    )
                    const rowClass = 'contact-channel flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-6 text-center'
                    return channel.href ? (
                      <a
                        key={channel.label}
                        href={channel.href}
                        className={rowClass}
                        {...(channel.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {row}
                      </a>
                    ) : (
                      <div key={channel.label} className={rowClass}>
                        {row}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="lg:border-l lg:border-white/10 lg:pl-12">
                {submitted ? (
                  <div className="py-6">
                    <h3 className="text-lg font-semibold">Message received</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      Thank you. A member of the team will come back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Send an enquiry</p>
                    <h3 className="mt-2 text-xl font-semibold">How can we help?</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-medium">
                        Name <span className="text-neutral-400">*</span>
                        <input required name="name" placeholder="Your name" className={fieldClass} />
                      </label>
                      <label className="block text-sm font-medium">
                        Email <span className="text-neutral-400">*</span>
                        <input required type="email" name="email" placeholder="your@email.com" className={fieldClass} />
                      </label>
                    </div>
                    <label className="mt-4 block text-sm font-medium">
                      Phone <span className="font-normal text-neutral-400">(optional)</span>
                      <input type="tel" name="phone" placeholder="Your phone number" className={fieldClass} />
                    </label>
                    <label className="mt-4 block text-sm font-medium">
                      Message <span className="text-neutral-400">*</span>
                      <textarea required name="message" rows={4} placeholder="How can we help you?" className={fieldClass} />
                    </label>
                    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                    {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 disabled:opacity-60"
                    >
                      <SendIcon />
                      {sending ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {address && <p className="mt-6 text-center text-xs leading-relaxed text-neutral-500">{address}</p>}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-content items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Plan the enquiry</p>
            <h2 className="mt-3 max-w-[12ch] text-[2rem] font-medium leading-[1.08] tracking-tight sm:text-5xl">
              A clear brief. A calmer arrival.
            </h2>
            <img src="/images/contact-brief.jpg" alt="" className="mt-6 h-56 w-full rounded-2xl object-cover object-center sm:h-72" />
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-300">
              A few details help us recommend the right vehicle and confirm the journey clearly.
            </p>
            <ol className="mt-4">
              {steps.map((step) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-white/10 py-5">
                  <span className="pt-0.5 text-sm text-neutral-500">{step.number}</span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-400">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {whatsappHref && (
              <p className="text-sm text-neutral-300">
                Need an answer now?{' '}
                <a href={whatsappHref} className="font-semibold text-white" target="_blank" rel="noreferrer">
                  Message us on WhatsApp
                </a>
                .
              </p>
            )}
          </div>

          <aside className="rounded-[1.25rem] border border-white/10 bg-[#141414] p-6 sm:p-7 lg:mt-16">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-neutral-300">
              <PinIcon />
            </span>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Our office</p>
            <p className="mt-3 text-xl font-semibold leading-snug">{address}</p>
            {mapsHref && (
              <a href={mapsHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Get directions
                <span aria-hidden="true">›</span>
              </a>
            )}
          </aside>
        </div>
      </section>

      <section className="px-4 pb-20 pt-6 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Quick answers</p>
          <h2 className="mt-3 text-[1.7rem] font-semibold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            A few things you may want to know first.
          </h2>
          <div className="scrollbar-none mt-5 flex gap-2 overflow-x-auto">
            {groups.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setGroup(item)
                  setShowAll(false)
                  setOpenKey(null)
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  group === item ? 'bg-white text-neutral-950' : 'bg-white/10 text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="sr-only">Search frequently asked questions</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setShowAll(false)
              }}
              placeholder="Search questions"
              className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-neutral-500 focus:border-white/40"
            />
          </label>
          <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {visible.map((item) => {
              const key = `${item.groupTitle}-${item.question}`
              const open = openKey === key
              return (
                <div key={key}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenKey(open ? null : key)}
                  >
                    <span className="text-sm font-medium sm:text-base">{item.question}</span>
                    <span className="text-xl leading-none text-neutral-400">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="pb-4 text-sm leading-relaxed text-neutral-300">{item.answer}</p>}
                </div>
              )
            })}
            {visible.length === 0 && <p className="py-6 text-sm text-neutral-400">No questions match that search.</p>}
          </div>
          {questions.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="mt-4 text-sm font-semibold text-white"
            >
              {showAll ? 'Fewer questions' : 'More questions'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

const steps = [
  {
    number: '01',
    title: 'Where and when',
    text: 'Collection address, destination, travel date and pickup time. For an airport journey, add the flight number so we can confirm the terminal and follow any change.',
  },
  {
    number: '02',
    title: 'Passengers and luggage',
    text: 'Tell us how many people are travelling and how much luggage you expect, so we can recommend the most comfortable vehicle.',
  },
  {
    number: '03',
    title: 'Anything extra',
    text: 'Include child seats, extra stops, access needs, or a return. We confirm availability and the fare before you travel.',
  },
]

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d="M2 8.5 14 2l-4.5 12-2-5.2L2 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function ChannelIcon({ name, large = false }: { name: 'phone' | 'whatsapp' | 'email'; large?: boolean }) {
  const box = large ? 'h-12 w-12' : 'h-8 w-8'
  const glyph = large ? 'h-6 w-6' : 'h-[17px] w-[17px]'
  return (
    <span className={`flex ${box} shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.07]`}>
      {name === 'phone' && (
        <svg viewBox="0 0 24 24" className={glyph} fill="none" aria-hidden="true">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"
            stroke="#58A9FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.65"
          />
        </svg>
      )}
      {name === 'whatsapp' && (
        <svg viewBox="0 0 24 24" className={glyph} aria-hidden="true">
          <path
            fill="#25D366"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 7.021 2.91 9.82 9.82 0 0 1 2.9 7.025c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.52 3.49Z"
          />
        </svg>
      )}
      {name === 'email' && (
        <svg viewBox="0 0 24 24" className={glyph} aria-hidden="true">
          <path fill="#4285F4" d="M1.636 18.727h3.637V9.91L.52 6.345v11.473c0 .502.407.909.91.909h.206Z" />
          <path fill="#34A853" d="M18.727 18.727h3.637c.502 0 .909-.407.909-.909V6.345L18.727 9.91v8.817Z" />
          <path fill="#EA4335" d="M18.727 4.25v5.66l4.546-3.565V5.16c0-1.124-1.283-1.766-2.182-1.091L18.727 4.25Z" />
          <path fill="#FBBC04" d="M5.273 9.91V4.25L12 9.295l6.727-5.046v5.66L12 14.956 5.273 9.91Z" />
          <path fill="#C5221F" d="M.52 5.16v1.185L5.273 9.91V4.25L2.702 3.16C1.803 2.486.52 3.126.52 4.25v.91Z" />
        </svg>
      )}
    </span>
  )
}

export default Contact
