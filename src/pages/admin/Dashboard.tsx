import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { upload } from '@vercel/blob/client'
import { DEFAULT_CONTENT } from '../../content/defaults'
import { mergeContent } from '../../content/merge'
import type { SiteContent } from '../../content/types'
import type { VehicleId } from '../../data/pricing'
import type { ServiceFeatureSection } from '../../types'
import { Area, Field, Lines, MediaField, Section } from './fields'

const PAGE_TABS = ['Site', 'Home', 'Services', 'Fleet', 'Prices', 'FAQs', 'Reviews', 'Contact', 'Book', 'Privacy'] as const

function serviceTabId(slug: string) {
  return `service:${slug}`
}

const REMOVED_MEDIA = 'lunr-removed-media'

function readRemoved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REMOVED_MEDIA) || '{}') as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0),
    )
  } catch {
    return {}
  }
}

function writeRemoved(value: Record<string, string>) {
  try {
    localStorage.setItem(REMOVED_MEDIA, JSON.stringify(value))
  } catch {
    // The photo can still be restored from the original until the page is closed.
  }
}

const REMOVED_SECTIONS = 'lunr-removed-sections'

type StashedSection = {
  id: string
  slug: string
  index: number
  section: ServiceFeatureSection
}

function readStashedSections() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REMOVED_SECTIONS) || '[]') as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is StashedSection => {
      if (!item || typeof item !== 'object') return false
      const row = item as StashedSection
      return typeof row.id === 'string' && typeof row.slug === 'string' && typeof row.index === 'number' && !!row.section && typeof row.section.heading === 'string' && Array.isArray(row.section.paragraphs)
    })
  } catch {
    return []
  }
}

function writeStashedSections(value: StashedSection[]) {
  try {
    localStorage.setItem(REMOVED_SECTIONS, JSON.stringify(value))
  } catch {
    // The section can still be restored from the original until the page is closed.
  }
}
const mediaAccept = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime'
const imageAccept = 'image/jpeg,image/png,image/webp,image/gif'

function clean(lines: string[]) {
  return lines.map((line) => line.trim()).filter(Boolean)
}

function Dashboard() {
  const navigate = useNavigate()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [tab, setTab] = useState<string>('Site')
  const [storageConfigured, setStorageConfigured] = useState(true)
  const [blobReady, setBlobReady] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [removed, setRemoved] = useState<Record<string, string>>(readRemoved)
  const [stashedSections, setStashedSections] = useState<StashedSection[]>(readStashedSections)

  useEffect(() => {
    fetch('/api/admin/content', { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) {
          navigate('/admin/login')
          return null
        }
        return response.json() as Promise<{ content?: unknown; storageConfigured?: boolean; blob?: boolean; error?: string }>
      })
      .then((data) => {
        if (!data) return
        setContent(mergeContent(data.content))
        setStorageConfigured(data.storageConfigured !== false)
        setBlobReady(Boolean(data.blob))
      })
      .catch(() => setError('The dashboard could not be loaded.'))
  }, [navigate])

  async function persist(next: SiteContent, message: string) {
    setSaving(true)
    setError('')
    setStatus('')
    const response = await fetch('/api/admin/content', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
    setSaving(false)
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    if (!response.ok) {
      setError(data?.error || 'Could not save.')
      return false
    }
    setStatus(message)
    return true
  }

  async function uploadFile(file: File) {
    const probe = await fetch('/api/admin/upload', { credentials: 'include' })
    if (probe.status === 401) {
      navigate('/admin/login')
      throw new Error('Log in again.')
    }
    const info = (await probe.json().catch(() => null)) as { mode?: string } | null
    if (info?.mode === 'client') {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob',
        contentType: file.type || undefined,
        multipart: file.size > 4 * 1024 * 1024,
      })
      return blob.url
    }
    const body = new FormData()
    body.append('file', file)
    const response = await fetch('/api/admin/upload', { method: 'POST', body, credentials: 'include' })
    const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null
    if (!response.ok || !data?.url) throw new Error(data?.error || 'Upload failed.')
    return data.url
  }

  function rememberRemoved(key: string, url: string) {
    if (!url) return
    const next = { ...removed, [key]: url }
    setRemoved(next)
    writeRemoved(next)
  }

  function forgetRemoved(key: string) {
    if (!removed[key]) return
    const next = { ...removed }
    delete next[key]
    setRemoved(next)
    writeRemoved(next)
  }

  async function clearMedia(key: string, value: string, apply: (current: SiteContent, url: string) => SiteContent) {
    setError('')
    setStatus('')
    rememberRemoved(key, value)
    const next = apply(content as SiteContent, '')
    setContent(next)
    await persist(next, 'Photo removed. Reset brings it back.')
  }

  async function restoreMedia(key: string, fallback: string, apply: (current: SiteContent, url: string) => SiteContent) {
    const url = removed[key] || fallback
    if (!url) return
    setError('')
    setStatus('')
    const next = apply(content as SiteContent, url)
    setContent(next)
    const saved = await persist(next, 'Photo restored.')
    if (saved) forgetRemoved(key)
  }

  async function removeUploadedFile(url: string) {
    if (!url.includes('.blob.vercel-storage.com/') && !url.startsWith('/uploads/')) return
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    }).catch(() => {})
  }

  async function changeMedia(key: string, file: File, previous: string, apply: (current: SiteContent, url: string) => SiteContent) {
    setUploading(key)
    setError('')
    try {
      const url = await uploadFile(file)
      const next = apply(content as SiteContent, url)
      setContent(next)
      const saved = await persist(next, 'Photo or video saved. The live site is updated.')
      if (saved && previous && previous !== url) {
        forgetRemoved(key)
        await removeUploadedFile(previous)
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Upload failed.')
    } finally {
      setUploading('')
    }
  }

  if (!content) {
    return <main className="flex min-h-screen items-center justify-center bg-black text-white">{error || 'Loading…'}</main>
  }

  const service = content.services.find((item) => serviceTabId(item.slug) === tab)
  const tabs = [
    ...PAGE_TABS.slice(0, 3).map((id) => ({ id, label: id })),
    ...content.services.map((item) => ({ id: serviceTabId(item.slug), label: item.navLabel })),
    ...PAGE_TABS.slice(3).map((id) => ({ id, label: id })),
  ]
  const updateService = (patch: Partial<SiteContent['services'][number]>) => {
    if (!service) return
    const services = content.services.map((item) => (item.slug === service.slug ? { ...item, ...patch } : item))
    setContent({ ...content, services })
  }
  const updateSection = (sectionIndex: number, patch: Partial<ServiceFeatureSection>) => {
    if (!service) return
    updateService({
      sections: service.sections.map((section, index) => (index === sectionIndex ? { ...section, ...patch } : section)),
    })
  }
  const removedForService = service ? stashedSections.filter((item) => item.slug === service.slug) : []
  const originalSections = service ? DEFAULT_CONTENT.services.find((item) => item.slug === service.slug)?.sections ?? [] : []
  const missingSections = service && service.sections.length < originalSections.length
    ? originalSections.filter((section) => !service.sections.some((item) => item.heading === section.heading) && !removedForService.some((item) => item.section.heading === section.heading))
    : []
  const replaceServiceSections = (sections: ServiceFeatureSection[]) => {
    if (!service) return content
    return {
      ...content,
      services: content.services.map((item) => (item.slug === service.slug ? { ...item, sections } : item)),
    }
  }
  const restoreStashedSection = async (id: string) => {
    if (!service) return
    const stashed = stashedSections.find((item) => item.id === id && item.slug === service.slug)
    if (!stashed) return
    const sections = [...service.sections]
    sections.splice(Math.min(stashed.index, sections.length), 0, stashed.section)
    const next = replaceServiceSections(sections)
    setContent(next)
    const saved = await persist(next, 'Section restored.')
    if (!saved) return
    const remaining = stashedSections.filter((item) => item.id !== id)
    setStashedSections(remaining)
    writeStashedSections(remaining)
  }
  const restoreDefaultSection = async (heading: string) => {
    if (!service) return
    const index = originalSections.findIndex((item) => item.heading === heading)
    const section = originalSections[index]
    if (!section) return
    const sections = [...service.sections]
    sections.splice(index < 0 ? sections.length : Math.min(index, sections.length), 0, structuredClone(section))
    const next = replaceServiceSections(sections)
    setContent(next)
    await persist(next, 'Section restored.')
  }
  const bindMedia = (key: string, value: string, accept: string, fallback: string, apply: (current: SiteContent, url: string) => SiteContent) => ({
    accept,
    value,
    uploading: uploading === key,
    onChange: (url: string) => setContent(apply(content, url)),
    onUpload: (file: File) => changeMedia(key, file, value, apply),
    onRemove: () => clearMedia(key, value, apply),
    onReset: !value && (removed[key] || fallback) ? () => restoreMedia(key, fallback, apply) : undefined,
  })

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="font-serif text-2xl text-brand-primary">LUNR dashboard</p>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm">
              View site
            </a>
            <button
              type="button"
              className="rounded-full bg-brand-primary px-4 py-2 text-sm font-bold text-brand-primary-contrast"
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
                navigate('/admin/login')
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {tabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${tab === item.id ? 'bg-brand-primary text-brand-primary-contrast' : 'bg-white/10 text-white/80'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6">
        {!storageConfigured && (
          <p className="rounded-xl bg-amber-100 px-4 py-3 text-sm text-amber-950">
            Connect a Neon database in the Vercel Storage tab, then redeploy. Until then, changes on the live site cannot be saved.
          </p>
        )}
        {!blobReady && (
          <p className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
            Photos and videos save on this computer for now. Connect Vercel Blob in the Storage tab before uploading on the live site.
          </p>
        )}
        {status && <p className="rounded-xl bg-emerald-950 px-4 py-3 text-sm text-emerald-100">{status}</p>}
        {error && <p className="rounded-xl bg-red-950 px-4 py-3 text-sm text-red-100">{error}</p>}

        {tab === 'Site' && (
          <Section title="Site">
            <Field label="Brand name" value={content.site.brandName} onChange={(brandName) => setContent({ ...content, site: { ...content.site, brandName } })} />
            <Field label="Tagline" value={content.site.tagline} onChange={(tagline) => setContent({ ...content, site: { ...content.site, tagline } })} />
            <MediaField label="Logo" {...bindMedia('logo', content.site.logo, imageAccept, DEFAULT_CONTENT.site.logo, (current, url) => ({ ...current, site: { ...current.site, logo: url } }))} />
            <Field label="WhatsApp" value={content.site.whatsapp} onChange={(whatsapp) => setContent({ ...content, site: { ...content.site, whatsapp } })} />
            <Field label="Phone" value={content.site.phone} onChange={(phone) => setContent({ ...content, site: { ...content.site, phone } })} />
            <Field label="Mobile" value={content.site.mobile} onChange={(mobile) => setContent({ ...content, site: { ...content.site, mobile } })} />
            <Field label="Email" value={content.site.email} onChange={(email) => setContent({ ...content, site: { ...content.site, email } })} />
            <Field label="Address line 1" value={content.site.address.line1} onChange={(line1) => setContent({ ...content, site: { ...content.site, address: { ...content.site.address, line1 } } })} />
            <Field label="Address line 2" value={content.site.address.line2} onChange={(line2) => setContent({ ...content, site: { ...content.site, address: { ...content.site.address, line2 } } })} />
            <Field label="Google reviews link" value={content.site.googleReviewsUrl} onChange={(googleReviewsUrl) => setContent({ ...content, site: { ...content.site, googleReviewsUrl } })} />
            <Area label="Footer text" value={content.site.footerText} onChange={(footerText) => setContent({ ...content, site: { ...content.site, footerText } })} />
            <Lines label="Areas, one per line" value={content.areas} onChange={(areas) => setContent({ ...content, areas })} />
          </Section>
        )}

        {tab === 'Home' && (
          <>
            <Section title="Hero">
              <Field label="Heading" value={content.home.heroHeading} onChange={(heroHeading) => setContent({ ...content, home: { ...content.home, heroHeading } })} />
              <Field label="Gold words" value={content.home.heroHighlight} onChange={(heroHighlight) => setContent({ ...content, home: { ...content.home, heroHighlight } })} />
              <Area label="Subtext" value={content.home.heroSubtext} onChange={(heroSubtext) => setContent({ ...content, home: { ...content.home, heroSubtext } })} rows={3} />
              <MediaField label="Hero video" {...bindMedia('hero-video', content.home.heroVideo, mediaAccept, DEFAULT_CONTENT.home.heroVideo, (current, url) => ({ ...current, home: { ...current.home, heroVideo: url } }))} />
            </Section>
            <Section title="Intro">
              <Field label="Heading" value={content.home.luxuryHeading} onChange={(luxuryHeading) => setContent({ ...content, home: { ...content.home, luxuryHeading } })} />
              <Field label="Gold words" value={content.home.luxuryHighlight} onChange={(luxuryHighlight) => setContent({ ...content, home: { ...content.home, luxuryHighlight } })} />
              <Lines label="Paragraphs, one per line" value={content.home.luxuryParagraphs} onChange={(luxuryParagraphs) => setContent({ ...content, home: { ...content.home, luxuryParagraphs } })} rows={8} />
              <Field label="Sign-off" value={content.home.luxurySignoff} onChange={(luxurySignoff) => setContent({ ...content, home: { ...content.home, luxurySignoff } })} />
              <Field label="Gold bar" value={content.home.goldBar} onChange={(goldBar) => setContent({ ...content, home: { ...content.home, goldBar } })} />
            </Section>
            <Section title="Trust and respect">
              <Field label="Trust heading" value={content.home.trustHeading} onChange={(trustHeading) => setContent({ ...content, home: { ...content.home, trustHeading } })} />
              <Field label="Trust gold words" value={content.home.trustHighlight} onChange={(trustHighlight) => setContent({ ...content, home: { ...content.home, trustHighlight } })} />
              <Lines label="Trust paragraphs" value={content.home.trustParagraphs} onChange={(trustParagraphs) => setContent({ ...content, home: { ...content.home, trustParagraphs } })} />
              <Field label="Time heading" value={content.home.trustTimeHeading} onChange={(trustTimeHeading) => setContent({ ...content, home: { ...content.home, trustTimeHeading } })} />
              <Area label="Time text" value={content.home.trustTimeText} onChange={(trustTimeText) => setContent({ ...content, home: { ...content.home, trustTimeText } })} />
              <Field label="Discretion heading" value={content.home.trustDiscretionHeading} onChange={(trustDiscretionHeading) => setContent({ ...content, home: { ...content.home, trustDiscretionHeading } })} />
              <Area label="Discretion text" value={content.home.trustDiscretionText} onChange={(trustDiscretionText) => setContent({ ...content, home: { ...content.home, trustDiscretionText } })} />
              <MediaField label="Trust photo" {...bindMedia('trust', content.home.trustImage, imageAccept, DEFAULT_CONTENT.home.trustImage, (current, url) => ({ ...current, home: { ...current.home, trustImage: url } }))} />
              <Field label="Respect heading" value={content.home.respectHeading} onChange={(respectHeading) => setContent({ ...content, home: { ...content.home, respectHeading } })} />
              <Field label="Respect gold words" value={content.home.respectHighlight} onChange={(respectHighlight) => setContent({ ...content, home: { ...content.home, respectHighlight } })} />
              <Lines label="Respect paragraphs" value={content.home.respectParagraphs} onChange={(respectParagraphs) => setContent({ ...content, home: { ...content.home, respectParagraphs } })} />
              <MediaField label="Respect photo" {...bindMedia('respect', content.home.respectImage, imageAccept, DEFAULT_CONTENT.home.respectImage, (current, url) => ({ ...current, home: { ...current.home, respectImage: url } }))} />
            </Section>
            <Section title="Reviews, fleet and close">
              <Field label="Reviews heading" value={content.home.reviewsHeading} onChange={(reviewsHeading) => setContent({ ...content, home: { ...content.home, reviewsHeading } })} />
              <Field label="Reviews gold words" value={content.home.reviewsHighlight} onChange={(reviewsHighlight) => setContent({ ...content, home: { ...content.home, reviewsHighlight } })} />
              <Area label="Reviews text" value={content.home.reviewsText} onChange={(reviewsText) => setContent({ ...content, home: { ...content.home, reviewsText } })} />
              <Field label="Fleet heading" value={content.home.fleetHeading} onChange={(fleetHeading) => setContent({ ...content, home: { ...content.home, fleetHeading } })} />
              <Field label="Fleet gold words" value={content.home.fleetHighlight} onChange={(fleetHighlight) => setContent({ ...content, home: { ...content.home, fleetHighlight } })} />
              <Area label="Fleet text" value={content.home.fleetText} onChange={(fleetText) => setContent({ ...content, home: { ...content.home, fleetText } })} />
              <Lines label="Fleet points" value={content.home.fleetBullets} onChange={(fleetBullets) => setContent({ ...content, home: { ...content.home, fleetBullets } })} />
              <Field label="Fleet note" value={content.home.fleetNote} onChange={(fleetNote) => setContent({ ...content, home: { ...content.home, fleetNote } })} />
              <MediaField label="Fleet photo" {...bindMedia('home-fleet', content.home.fleetImage, imageAccept, DEFAULT_CONTENT.home.fleetImage, (current, url) => ({ ...current, home: { ...current.home, fleetImage: url } }))} />
              <Field label="Closing heading" value={content.home.closingHeading} onChange={(closingHeading) => setContent({ ...content, home: { ...content.home, closingHeading } })} />
              <Area label="Closing text" value={content.home.closingText} onChange={(closingText) => setContent({ ...content, home: { ...content.home, closingText } })} />
            </Section>
          </>
        )}

        {tab === 'Services' && (
          <Section title="Services page">
            <Field label="Heading" value={content.servicesPage.heading} onChange={(heading) => setContent({ ...content, servicesPage: { ...content.servicesPage, heading } })} />
            <Field label="Gold words" value={content.servicesPage.highlight} onChange={(highlight) => setContent({ ...content, servicesPage: { ...content.servicesPage, highlight } })} />
            <Area label="Subtext" value={content.servicesPage.subtext} onChange={(subtext) => setContent({ ...content, servicesPage: { ...content.servicesPage, subtext } })} />
            <Lines label="Intro paragraphs" value={content.servicesPage.paragraphs} onChange={(paragraphs) => setContent({ ...content, servicesPage: { ...content.servicesPage, paragraphs } })} />
            <p className="text-sm text-white/60">Each service has its own tab. Open that tab to change its text, hero photo, and card photo.</p>
          </Section>
        )}

        {service && (
          <>
            <Section title={service.navLabel}>
              <Field label="Menu name" value={service.navLabel} onChange={(navLabel) => updateService({ navLabel })} />
              <Field label="Hero heading" value={service.heroHeading} onChange={(heroHeading) => updateService({ heroHeading })} />
              <Field label="Gold words" value={service.heroHighlight ?? ''} onChange={(heroHighlight) => updateService({ heroHighlight })} />
              <Area label="Hero subtext" value={service.heroSubtext} onChange={(heroSubtext) => updateService({ heroSubtext })} />
              <MediaField label="Hero photo" {...bindMedia(`hero-${service.slug}`, service.heroImage ?? '', imageAccept, DEFAULT_CONTENT.services.find((item) => item.slug === service.slug)?.heroImage ?? '', (current, url) => ({ ...current, services: current.services.map((item) => item.slug === service.slug ? { ...item, heroImage: url } : item) }))} />
              <MediaField label="Hero video" {...bindMedia(`video-${service.slug}`, service.heroVideo ?? '', mediaAccept, DEFAULT_CONTENT.services.find((item) => item.slug === service.slug)?.heroVideo ?? '', (current, url) => ({ ...current, services: current.services.map((item) => item.slug === service.slug ? { ...item, heroVideo: url } : item) }))} />
              <MediaField label="Card photo" {...bindMedia(`card-${service.slug}`, service.cardImage ?? '', imageAccept, DEFAULT_CONTENT.services.find((item) => item.slug === service.slug)?.cardImage ?? '', (current, url) => ({ ...current, services: current.services.map((item) => item.slug === service.slug ? { ...item, cardImage: url } : item) }))} />
              <p className="text-sm text-white/60">Hero photo is the large photo at the top of this service page. Card photo is the tile on the services list. Uploading one does not change the other.</p>
              <Field label="Closing heading" value={service.closingHeading} onChange={(closingHeading) => updateService({ closingHeading })} />
              <Area label="Closing text" value={service.closingText} onChange={(closingText) => updateService({ closingText })} />
              <Field label="Closing button" value={service.closingButtonLabel} onChange={(closingButtonLabel) => updateService({ closingButtonLabel })} />
            </Section>
            {service.sections.map((section, sectionIndex) => (
              <Section key={`${service.slug}-${sectionIndex}`} title={`Section ${sectionIndex + 1}`}>
                <Field label="Heading" value={section.heading} onChange={(heading) => updateSection(sectionIndex, { heading })} />
                <Field label="Gold words" value={section.highlight ?? ''} onChange={(highlight) => updateSection(sectionIndex, { highlight })} />
                <Lines label="Paragraphs, one per line" value={section.paragraphs} onChange={(paragraphs) => updateSection(sectionIndex, { paragraphs })} rows={6} />
                <Lines label="Bullet points, one per line" value={section.bullets ?? []} onChange={(bullets) => updateSection(sectionIndex, { bullets })} />
                <MediaField label="Photo" {...bindMedia(`${service.slug}-section-${sectionIndex}`, section.image ?? '', imageAccept, DEFAULT_CONTENT.services.find((item) => item.slug === service.slug)?.sections[sectionIndex]?.image ?? '', (current, url) => ({ ...current, services: current.services.map((item) => item.slug === service.slug ? { ...item, sections: item.sections.map((part, partIndex) => partIndex === sectionIndex ? { ...part, image: url } : part) } : item) }))} />
                <Field label="Button label" value={section.buttonLabel ?? ''} onChange={(buttonLabel) => updateSection(sectionIndex, { buttonLabel })} />
                <Field label="Button link" value={section.buttonTo ?? ''} onChange={(buttonTo) => updateSection(sectionIndex, { buttonTo })} />
              </Section>
            ))}
            {removedForService.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#141413] px-4 py-3">
                <p className="text-sm text-white/80">Removed section: {item.section.heading}</p>
                <button type="button" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-primary" onClick={() => restoreStashedSection(item.id)}>
                  Reset
                </button>
              </div>
            ))}
            {missingSections.map((section) => (
              <div key={section.heading} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#141413] px-4 py-3">
                <p className="text-sm text-white/80">Removed section: {section.heading}</p>
                <button type="button" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-primary" onClick={() => restoreDefaultSection(section.heading)}>
                  Reset
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm"
              onClick={() => updateService({ sections: [...service.sections, { heading: 'New section', paragraphs: [''] }] })}
            >
              Add section
            </button>
          </>
        )}

        {tab === 'Fleet' && (
          <Section title="Fleet page">
            <Field label="Heading" value={content.fleet.heading} onChange={(heading) => setContent({ ...content, fleet: { ...content.fleet, heading } })} />
            <Field label="Gold words" value={content.fleet.highlight} onChange={(highlight) => setContent({ ...content, fleet: { ...content.fleet, highlight } })} />
            <Area label="Subtext" value={content.fleet.subtext} onChange={(subtext) => setContent({ ...content, fleet: { ...content.fleet, subtext } })} />
            <MediaField label="Hero photo" {...bindMedia('fleet-image', content.fleet.image, imageAccept, DEFAULT_CONTENT.fleet.image, (current, url) => ({ ...current, fleet: { ...current.fleet, image: url } }))} />
            <MediaField label="Hero video" {...bindMedia('fleet-video', content.fleet.video, mediaAccept, DEFAULT_CONTENT.fleet.video, (current, url) => ({ ...current, fleet: { ...current.fleet, video: url } }))} />
            <Field label="Intro heading" value={content.fleet.introHeading} onChange={(introHeading) => setContent({ ...content, fleet: { ...content.fleet, introHeading } })} />
            <Area label="Intro text" value={content.fleet.introText} onChange={(introText) => setContent({ ...content, fleet: { ...content.fleet, introText } })} />
            <Field label="Closing heading" value={content.fleet.closingHeading} onChange={(closingHeading) => setContent({ ...content, fleet: { ...content.fleet, closingHeading } })} />
            <Area label="Closing text" value={content.fleet.closingText} onChange={(closingText) => setContent({ ...content, fleet: { ...content.fleet, closingText } })} />
            <p className="text-sm text-white/60">Vehicle photos and hourly rates are on the Prices tab.</p>
          </Section>
        )}

        {tab === 'Prices' && (
          <Section title="Prices">
            <Field label="Minimum hours" value={String(content.minimumHours)} onChange={(value) => setContent({ ...content, minimumHours: Math.max(4, Number(value) || 4) })} />
            {content.vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="grid gap-3 rounded-xl border border-white/10 p-3">
                <Field label="Name" value={vehicle.name} onChange={(name) => setContent({ ...content, vehicles: content.vehicles.map((item, itemIndex) => itemIndex === index ? { ...item, name } : item) })} />
                <Field label="Short name" value={vehicle.shortName} onChange={(shortName) => setContent({ ...content, vehicles: content.vehicles.map((item, itemIndex) => itemIndex === index ? { ...item, shortName } : item) })} />
                <Field label="Seats" value={vehicle.seats} onChange={(seats) => setContent({ ...content, vehicles: content.vehicles.map((item, itemIndex) => itemIndex === index ? { ...item, seats } : item) })} />
                <Field label="Price per hour" value={String(vehicle.hourly)} onChange={(hourly) => setContent({ ...content, vehicles: content.vehicles.map((item, itemIndex) => itemIndex === index ? { ...item, hourly: Number(hourly) || 0 } : item) })} />
                <MediaField label="Photo" {...bindMedia(vehicle.id, vehicle.image, imageAccept, DEFAULT_CONTENT.vehicles.find((item) => item.id === vehicle.id)?.image ?? '', (current, url) => ({ ...current, vehicles: current.vehicles.map((item) => item.id === vehicle.id ? { ...item, image: url } : item) }))} />
              </div>
            ))}
            {content.airports.map((airport, airportIndex) => (
              <div key={airport.id} className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2">
                <Field label="Airport" value={airport.name} onChange={(name) => setContent({ ...content, airports: content.airports.map((item, index) => index === airportIndex ? { ...item, name } : item) })} />
                {content.vehicles.map((vehicle) => (
                  <Field
                    key={vehicle.id}
                    label={`${vehicle.shortName} fixed fare`}
                    value={airport.prices[vehicle.id as VehicleId] == null ? '' : String(airport.prices[vehicle.id as VehicleId])}
                    onChange={(value) => {
                      const prices = { ...airport.prices }
                      if (value.trim() === '') delete prices[vehicle.id as VehicleId]
                      else prices[vehicle.id as VehicleId] = Number(value) || 0
                      setContent({ ...content, airports: content.airports.map((item, index) => index === airportIndex ? { ...item, prices } : item) })
                    }}
                  />
                ))}
              </div>
            ))}
          </Section>
        )}

        {tab === 'FAQs' && (
          <>
            <Section title="FAQs page">
              <Field label="Eyebrow" value={content.faqsPage.eyebrow} onChange={(eyebrow) => setContent({ ...content, faqsPage: { ...content.faqsPage, eyebrow } })} />
              <Field label="Heading" value={content.faqsPage.heading} onChange={(heading) => setContent({ ...content, faqsPage: { ...content.faqsPage, heading } })} />
              <Area label="Subtext" value={content.faqsPage.subtext} onChange={(subtext) => setContent({ ...content, faqsPage: { ...content.faqsPage, subtext } })} />
              <Field label="Section heading" value={content.faqsPage.sectionHeading} onChange={(sectionHeading) => setContent({ ...content, faqsPage: { ...content.faqsPage, sectionHeading } })} />
              <Area label="Section text" value={content.faqsPage.sectionText} onChange={(sectionText) => setContent({ ...content, faqsPage: { ...content.faqsPage, sectionText } })} />
              <MediaField label="Photo" {...bindMedia('faq-image', content.faqsPage.image, imageAccept, DEFAULT_CONTENT.faqsPage.image, (current, url) => ({ ...current, faqsPage: { ...current.faqsPage, image: url } }))} />
              <Field label="Closing heading" value={content.faqsPage.closingHeading} onChange={(closingHeading) => setContent({ ...content, faqsPage: { ...content.faqsPage, closingHeading } })} />
              <Area label="Closing text" value={content.faqsPage.closingText} onChange={(closingText) => setContent({ ...content, faqsPage: { ...content.faqsPage, closingText } })} />
            </Section>
            {content.faqs.map((group, groupIndex) => (
              <Section key={group.groupTitle + groupIndex} title={group.groupTitle || 'Question group'}>
                <Field label="Group title" value={group.groupTitle} onChange={(groupTitle) => setContent({ ...content, faqs: content.faqs.map((item, index) => index === groupIndex ? { ...item, groupTitle } : item) })} />
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid gap-2 rounded-xl border border-white/10 p-3">
                    <Field label="Question" value={item.question} onChange={(question) => setContent({ ...content, faqs: content.faqs.map((entry, index) => index === groupIndex ? { ...entry, items: entry.items.map((faq, faqIndex) => faqIndex === itemIndex ? { ...faq, question } : faq) } : entry) })} />
                    <Area label="Answer" value={item.answer} onChange={(answer) => setContent({ ...content, faqs: content.faqs.map((entry, index) => index === groupIndex ? { ...entry, items: entry.items.map((faq, faqIndex) => faqIndex === itemIndex ? { ...faq, answer } : faq) } : entry) })} />
                    <button type="button" className="text-left text-sm text-red-300" onClick={() => setContent({ ...content, faqs: content.faqs.map((entry, index) => index === groupIndex ? { ...entry, items: entry.items.filter((_, faqIndex) => faqIndex !== itemIndex) } : entry) })}>Remove question</button>
                  </div>
                ))}
                <button type="button" className="text-sm text-brand-primary" onClick={() => setContent({ ...content, faqs: content.faqs.map((entry, index) => index === groupIndex ? { ...entry, items: [...entry.items, { question: 'New question', answer: '' }] } : entry) })}>Add question</button>
              </Section>
            ))}
          </>
        )}

        {tab === 'Reviews' && (
          <Section title="Reviews">
            {content.testimonials.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-xl border border-white/10 p-3">
                <Field label="Name" value={item.name} onChange={(name) => setContent({ ...content, testimonials: content.testimonials.map((review, reviewIndex) => reviewIndex === index ? { ...review, name } : review) })} />
                <Area label="Quote" value={item.quote} onChange={(quote) => setContent({ ...content, testimonials: content.testimonials.map((review, reviewIndex) => reviewIndex === index ? { ...review, quote } : review) })} />
                <button type="button" className="text-left text-sm text-red-300" onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((_, reviewIndex) => reviewIndex !== index) })}>Remove review</button>
              </div>
            ))}
            <button type="button" className="text-sm text-brand-primary" onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: 'Name', quote: '' }] })}>Add review</button>
          </Section>
        )}

        {tab === 'Contact' && (
          <Section title="Contact page">
            <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(eyebrow) => setContent({ ...content, contact: { ...content.contact, eyebrow } })} />
            <Field label="Heading" value={content.contact.heading} onChange={(heading) => setContent({ ...content, contact: { ...content.contact, heading } })} />
            <Area label="Lead" value={content.contact.lead} onChange={(lead) => setContent({ ...content, contact: { ...content.contact, lead } })} />
            <MediaField label="Top photo" {...bindMedia('contact-hero', content.contact.heroImage, imageAccept, DEFAULT_CONTENT.contact.heroImage, (current, url) => ({ ...current, contact: { ...current.contact, heroImage: url } }))} />
            <Field label="Card eyebrow" value={content.contact.cardEyebrow} onChange={(cardEyebrow) => setContent({ ...content, contact: { ...content.contact, cardEyebrow } })} />
            <Field label="Card heading" value={content.contact.cardHeading} onChange={(cardHeading) => setContent({ ...content, contact: { ...content.contact, cardHeading } })} />
            <Area label="Card text" value={content.contact.cardText} onChange={(cardText) => setContent({ ...content, contact: { ...content.contact, cardText } })} />
            <Field label="Brief eyebrow" value={content.contact.briefEyebrow} onChange={(briefEyebrow) => setContent({ ...content, contact: { ...content.contact, briefEyebrow } })} />
            <Field label="Brief heading" value={content.contact.briefHeading} onChange={(briefHeading) => setContent({ ...content, contact: { ...content.contact, briefHeading } })} />
            <Area label="Brief text" value={content.contact.briefText} onChange={(briefText) => setContent({ ...content, contact: { ...content.contact, briefText } })} />
            <MediaField label="Brief photo" {...bindMedia('contact-brief', content.contact.briefImage, imageAccept, DEFAULT_CONTENT.contact.briefImage, (current, url) => ({ ...current, contact: { ...current.contact, briefImage: url } }))} />
            {content.contact.steps.map((step, index) => (
              <div key={step.number + index} className="grid gap-2 rounded-xl border border-white/10 p-3">
                <Field label="Step number" value={step.number} onChange={(number) => setContent({ ...content, contact: { ...content.contact, steps: content.contact.steps.map((item, itemIndex) => itemIndex === index ? { ...item, number } : item) } })} />
                <Field label="Step title" value={step.title} onChange={(title) => setContent({ ...content, contact: { ...content.contact, steps: content.contact.steps.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item) } })} />
                <Area label="Step text" value={step.text} onChange={(text) => setContent({ ...content, contact: { ...content.contact, steps: content.contact.steps.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item) } })} />
              </div>
            ))}
          </Section>
        )}

        {tab === 'Book' && (
          <Section title="Booking page">
            <MediaField label="Background photo" {...bindMedia('book', content.book.backgroundImage, imageAccept, DEFAULT_CONTENT.book.backgroundImage, (current, url) => ({ ...current, book: { backgroundImage: url } }))} />
            <p className="text-sm text-white/60">Fares on the booking form use the Prices tab.</p>
          </Section>
        )}

        {tab === 'Privacy' && (
          <Section title="Privacy policy">
            <Field label="Eyebrow" value={content.privacy.eyebrow} onChange={(eyebrow) => setContent({ ...content, privacy: { ...content.privacy, eyebrow } })} />
            <Field label="Heading" value={content.privacy.heading} onChange={(heading) => setContent({ ...content, privacy: { ...content.privacy, heading } })} />
            <Area label="Lead" value={content.privacy.lead} onChange={(lead) => setContent({ ...content, privacy: { ...content.privacy, lead } })} />
            <Field label="Updated date" value={content.privacy.updated} onChange={(updated) => setContent({ ...content, privacy: { ...content.privacy, updated } })} />
            {content.privacy.sections.map((section, index) => (
              <div key={section.number} className="grid gap-2 rounded-xl border border-white/10 p-3">
                <Field label="Number" value={section.number} onChange={(number) => setContent({ ...content, privacy: { ...content.privacy, sections: content.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, number } : item) } })} />
                <Field label="Kicker" value={section.kicker} onChange={(kicker) => setContent({ ...content, privacy: { ...content.privacy, sections: content.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, kicker } : item) } })} />
                <Field label="Title" value={section.title} onChange={(title) => setContent({ ...content, privacy: { ...content.privacy, sections: content.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item) } })} />
                <Lines label="Paragraphs" value={section.paragraphs} onChange={(paragraphs) => setContent({ ...content, privacy: { ...content.privacy, sections: content.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, paragraphs } : item) } })} rows={5} />
              </div>
            ))}
          </Section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl justify-end">
          <button
            type="button"
            disabled={saving}
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-brand-primary-contrast disabled:opacity-60"
            onClick={() => {
              const next: SiteContent = {
                ...content,
                areas: clean(content.areas),
                home: {
                  ...content.home,
                  luxuryParagraphs: clean(content.home.luxuryParagraphs),
                  trustParagraphs: clean(content.home.trustParagraphs),
                  respectParagraphs: clean(content.home.respectParagraphs),
                  fleetBullets: clean(content.home.fleetBullets),
                },
                servicesPage: { ...content.servicesPage, paragraphs: clean(content.servicesPage.paragraphs) },
                services: content.services.map((item) => ({
                  ...item,
                  sections: item.sections.map((section) => ({
                    ...section,
                    paragraphs: clean(section.paragraphs),
                    bullets: section.bullets ? clean(section.bullets) : undefined,
                  })),
                })),
              }
              setContent(next)
              void persist(next, 'Saved. Refresh the site to see it.')
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
