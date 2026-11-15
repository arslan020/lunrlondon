import type { ReactNode } from 'react'

export const inputClass =
  'mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary'
export const labelClass = 'block text-sm text-white/80'

export function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className={labelClass}>
      {label}
      <textarea className={inputClass} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function Lines({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (value: string[]) => void; rows?: number }) {
  return <Area label={label} rows={rows} value={value.join('\n')} onChange={(next) => onChange(next.split('\n'))} />
}

export function MediaField({
  label,
  value,
  accept,
  uploading,
  onUpload,
  onChange,
  onRemove,
  onReset,
}: {
  label: string
  value: string
  accept: string
  uploading: boolean
  onUpload: (file: File) => void
  onChange: (value: string) => void
  onRemove?: () => void
  onReset?: () => void
}) {
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value) || value.startsWith('data:video')
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="text-sm text-white/80">{label}</p>
      {value &&
        (isVideo ? (
          <video src={value} className="mt-2 max-h-40 w-full rounded-lg bg-black object-contain" muted controls />
        ) : (
          <img src={value} alt="" className="mt-2 max-h-40 w-full rounded-lg bg-black object-contain" />
        ))}
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/photo.jpg or a full URL" />
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) onUpload(file)
            }}
          />
        </label>
        {value && onRemove && (
          <button type="button" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-red-300 disabled:opacity-60" disabled={uploading} onClick={onRemove}>
            Remove
          </button>
        )}
        {!value && onReset && (
          <button type="button" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-primary disabled:opacity-60" disabled={uploading} onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141413] p-4 sm:p-5">
      <h2 className="font-serif text-2xl text-white">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  )
}
