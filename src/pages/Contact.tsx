import { useState, type FormEvent } from 'react'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import { siteConfig } from '../siteConfig'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-[#141413] text-white placeholder-neutral-500 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary'
const labelClass = 'block text-sm font-medium text-white mb-1'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Wire this up to your email/CRM provider of choice.
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        heading="We're Ready to Assist Your Travel Needs"
        highlight="Ready"
        subtext="Clear communication and careful planning, from first contact through to the end of your journey."
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading heading="Get in Touch" />
            <ul className="mt-8 space-y-4 text-neutral-200">
              {siteConfig.phone && (
                <li>
                  <span className="block text-xs uppercase tracking-wide text-neutral-500">Phone</span>
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="font-medium">
                    {siteConfig.phone}
                  </a>
                </li>
              )}
              {siteConfig.mobile && (
                <li>
                  <span className="block text-xs uppercase tracking-wide text-neutral-500">Mobile</span>
                  <a href={`tel:${siteConfig.mobile.replace(/\s/g, '')}`} className="font-medium">
                    {siteConfig.mobile}
                  </a>
                </li>
              )}
              {siteConfig.email && (
                <li>
                  <span className="block text-xs uppercase tracking-wide text-neutral-500">Email</span>
                  <a href={`mailto:${siteConfig.email}`} className="font-medium">
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li>
                <span className="block text-xs uppercase tracking-wide text-neutral-500">Address</span>
                <span className="font-medium">
                  {siteConfig.address.line1}, {siteConfig.address.line2}
                </span>
              </li>
            </ul>
          </div>

          <div>
            {submitted ? (
              <div className="bg-neutral-900 rounded-xl p-8 text-center">
                <h3 className="font-serif text-xl font-semibold text-white">Thank you</h3>
                <p className="mt-3 text-neutral-300">
                  Your message has been received. A member of our team will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Your Name
                  </label>
                  <input id="name" name="name" type="text" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Contact Number
                  </label>
                  <input id="phone" name="phone" type="tel" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>
                    How can we help?
                  </label>
                  <textarea id="message" name="message" rows={5} required className={inputClass} />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-brand-primary-contrast transition hover:-translate-y-px"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
