import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { siteConfig } from '../siteConfig'

const sections = [
  {
    number: '01',
    title: 'Who is responsible',
    kicker: 'The controller for your information',
    paragraphs: [
      `${siteConfig.brandName} is responsible for the personal information collected on this website when you ask about a journey or request a booking.`,
      siteConfig.email
        ? `A privacy question can be sent to ${siteConfig.email}, or through the contact page. Include enough detail for us to find the enquiry or booking, and leave out sensitive information we do not need.`
        : 'A privacy question can be sent through the contact page. Include enough detail for us to find the enquiry or booking, and leave out sensitive information we do not need.',
    ],
  },
  {
    number: '02',
    title: 'Information we receive',
    kicker: 'What we collect',
    paragraphs: [
      'A booking request can include your name, telephone number, email address, travel date and time, pickup and destination, the airport where that applies, the hours for hourly hire, whether you need a return, the vehicle you choose, and any note you add.',
      'The contact form asks for your name, email address, an optional telephone number, and your message. This website does not take card payments, and it does not store card numbers.',
    ],
  },
  {
    number: '03',
    title: 'Why we use it',
    kicker: 'Our reasons',
    paragraphs: [
      'We use these details to reply, price the journey you described, and arrange the chauffeur service if you go ahead. That includes contacting you about the booking and noting a change you ask for.',
      'We also keep what we need to run the service properly: to see what was requested, to deal with a later question about that journey, and to prevent misuse. We do not use your details for unrelated marketing.',
    ],
  },
  {
    number: '04',
    title: 'Who else sees it',
    kicker: 'Sharing',
    paragraphs: [
      `${siteConfig.brandName} uses enquiry and booking details to respond and arrange the journey. This website does not pass them to a payment company, a call-tracking service, or an advertising network.`,
      'A directions link opens a map on a separate page. What you do there is covered by that map service, not by this policy.',
    ],
  },
  {
    number: '05',
    title: 'How long information remains',
    kicker: 'Retention',
    paragraphs: [
      'An enquiry is kept for as long as we need it to reply or to sort out a question about it. Booking details stay for as long as we need them to complete the journey and keep a clear record of what was arranged.',
      'We do not keep personal information with no purpose. Access is limited to the people who need it to handle your enquiry or journey.',
    ],
  },
  {
    number: '06',
    title: 'Your choices',
    kicker: 'Your data protection rights',
    paragraphs: [
      'You can ask for a copy of the personal information we hold, ask us to correct it, ask us to delete it, or ask us to limit how we use it. You can also object to a use that is not required to arrange a journey you have requested.',
      'Send the request through the contact page. We may ask you to confirm who you are, so the details are not shared with the wrong person. If a record has to be kept, we will tell you why it cannot be deleted yet.',
    ],
  },
  {
    number: '07',
    title: 'Questions and complaints',
    kicker: 'How to reach us or the ICO',
    paragraphs: [
      'Please contact us first through the contact page, so we can look at what happened and reply. You can also complain to the UK Information Commissioner’s Office. The ICO publishes its own contact and complaint details.',
    ],
  },
]

function PrivacyPolicy() {
  return (
    <div className="bg-black text-white">
      <section className="px-4 pb-6 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Privacy policy</p>
          <h1 className="mt-4 max-w-[16ch] font-serif text-4xl font-medium leading-[1.08] text-white sm:text-6xl">
            How we look after your personal information
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-300 sm:text-base">
            A plain account of the details we ask for, why we use them, and the choices you have.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/book">Book now / Get quote</Button>
            <Button to="/contact" variant="outline">
              Contact
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-3xl border-t border-white/10 pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-primary">
              Home
            </Link>
            <span className="px-2 text-neutral-600">/</span>
            <span className="text-neutral-200">Privacy Policy</span>
          </nav>
          <p className="mt-4 text-sm text-neutral-400">
            {siteConfig.brandName} · Updated 10 November 2026
          </p>

          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <article key={section.number}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                  {section.number} — {section.kicker}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-[15px] leading-relaxed text-neutral-300 sm:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.number === '07' && (
                  <a
                    href="https://ico.org.uk/make-a-complaint/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm text-brand-primary underline underline-offset-4 hover:text-brand-secondary"
                  >
                    Your data protection rights at the ICO
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Keep exploring</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link to="/book" className="text-white hover:text-brand-primary">
                Book now / Get quote
              </Link>
              <Link to="/chauffeur-services" className="text-white hover:text-brand-primary">
                Our services
              </Link>
              <Link to="/our-luxury-fleet" className="text-white hover:text-brand-primary">
                Our fleet
              </Link>
              <Link to="/contact" className="text-white hover:text-brand-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
