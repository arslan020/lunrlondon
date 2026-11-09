import PageHero from '../components/PageHero'
import { siteConfig } from '../siteConfig'

function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        heading="Privacy Policy"
        subtext="How we collect, use, and protect your information."
      />
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="text-neutral-300 leading-relaxed">
            This page explains how {siteConfig.brandName} collects, uses, and protects personal
            information submitted through this website, including booking and contact forms.
            Replace this placeholder text with your client's full privacy policy before launch.
          </p>
          {siteConfig.email && (
            <p className="mt-4 text-neutral-300 leading-relaxed">
              For any questions about this policy, contact us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
              .
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicy
