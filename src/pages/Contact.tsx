import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { faqGroups } from '../data/faqs'
import { siteConfig } from '../siteConfig'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none placeholder:text-neutral-500 focus:border-white/30'

function digits(value: string) {
  return value.replace(/[^\d+]/g, '')
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)

  const phone = siteConfig.phone || siteConfig.mobile
  const phoneHref = phone ? `tel:${digits(phone)}` : ''
  const whatsappHref = phone ? `https://wa.me/${digits(phone).replace(/^\+/, '')}` : ''
  const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : ''
  const address = [siteConfig.address.line1, siteConfig.address.line2].filter(Boolean).join(', ')

  const channels = [
    phoneHref ? { label: 'Call', detail: phone, href: phoneHref, icon: 'phone' as const } : null,
    whatsappHref ? { label: 'WhatsApp', detail: 'Message the team', href: whatsappHref, icon: 'whatsapp' as const } : null,
    emailHref ? { label: 'Email', detail: siteConfig.email, href: emailHref, icon: 'email' as const } : null,
  ].filter((item) => item != null)
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
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

          <div id="enquiry" className="scroll-mt-28 rounded-[1.25rem] border border-white/10 bg-[#111111] p-5 sm:p-8 lg:p-10">
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Get in touch</p>
                <h2 className="mt-3 text-[1.85rem] font-semibold uppercase leading-[1.02] tracking-tight sm:text-[2.6rem]">
                  Talk to a person, any hour.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300">
                  See a fare online, and reach the team when you want to talk the journey through.
                </p>
                <Link to="/book" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">
                  Book now / Get quote
                  <span aria-hidden="true">›</span>
                </Link>

                {channels.length > 0 && (
                  <div className="mt-6 border-t border-white/10">
                    {channels.map((channel) => (
                      <a
                        key={channel.label}
                        href={channel.href}
                        className="flex items-center gap-4 border-b border-white/10 py-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15">
                          <ChannelIcon name={channel.icon} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{channel.label}</span>
                          <span className="mt-0.5 block truncate text-sm text-neutral-400">{channel.detail}</span>
                        </span>
                        <span className="text-neutral-500" aria-hidden="true">
                          ›
                        </span>
                      </a>
                    ))}
                  </div>
                )}
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
                    <button
                      type="submit"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950"
                    >
                      <SendIcon />
                      Send message
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
            <img src="/images/airport-arrival.jpg" alt="" className="mt-6 h-56 w-full rounded-2xl object-cover sm:h-72" />
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
            {phoneHref && (
              <p className="text-sm text-neutral-300">
                Need an answer now?{' '}
                <a href={phoneHref} className="font-semibold text-white">
                  Call {phone}
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
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
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

function ChannelIcon({ name }: { name: 'phone' | 'whatsapp' | 'email' }) {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]" aria-hidden="true">
        <path d="M12 3.2A8.7 8.7 0 0 0 4.4 16.3L3.2 21l4.8-1.2A8.7 8.7 0 1 0 12 3.2Zm4.8 12.3c-.2.6-1.2 1.1-1.6 1.1-.4.1-.9.2-2.6-.6-2.2-.9-3.6-3.1-3.7-3.3-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2 0 .3-.1.5l-.3.4c-.1.2-.3.3-.1.6.2.3.7 1.1 1.5 1.8.9.8 1.7 1 2 .1.2-.1.4-.2.6-.1l1.5.7c.2.1.4.2.4.3.1.3 0 .8-.2 1.1Z" />
      </svg>
    )
  }
  if (name === 'email') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M8 4h3l1 4-2 1a12 12 0 0 0 5 5l1-2 4 1v3c0 1-1 2-2 2A15 15 0 0 1 6 6c0-1 1-2 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default Contact
