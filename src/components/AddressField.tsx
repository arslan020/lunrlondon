import { useEffect, useId, useRef, useState } from 'react'

type Suggestion = {
  placeId: string
  main: string
  secondary: string
  label: string
}

type AddressFieldProps = {
  label: string
  value: string
  placeId: string
  placeholder: string
  required?: boolean
  className: string
  onChange: (text: string, placeId: string) => void
}

function AddressField({ label, value, placeId, placeholder, required, className, onChange }: AddressFieldProps) {
  const listId = useId()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const session = useRef(crypto.randomUUID())
  const chosen = useRef('')

  useEffect(() => {
    if (value.trim().length < 2 || value === chosen.current) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      void fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', input: value, sessionToken: session.current }),
        signal: controller.signal,
      })
        .then(async (response) => {
          const data = (await response.json()) as { suggestions?: Suggestion[] }
          if (!response.ok) return
          const next = Array.isArray(data.suggestions) ? data.suggestions : []
          setSuggestions(next)
          setOpen(next.length > 0)
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestions([])
        })
    }, 280)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [value])

  const choose = (item: Suggestion) => {
    chosen.current = item.label
    session.current = crypto.randomUUID()
    onChange(item.label, item.placeId)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <label className={`relative block text-sm font-medium ${open ? 'z-30' : ''}`}>
      {label}
      <input
        required={required}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        className={`${className} mt-1`}
        onChange={(event) => {
          chosen.current = ''
          onChange(event.target.value, '')
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
      />
      {value.trim().length >= 2 && !placeId && !open && (
        <span className="mt-1 block text-xs font-normal text-white/50">Select an address from the list.</span>
      )}
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-white/15 bg-neutral-950 py-1 shadow-xl">
          {suggestions.map((item) => (
            <li key={item.placeId} role="option">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-white/10"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
              >
                <span className="block text-sm font-semibold text-white">{item.main}</span>
                {item.secondary && <span className="block text-xs font-normal text-white/50">{item.secondary}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  )
}

export default AddressField
