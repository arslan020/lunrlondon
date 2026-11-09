import { useState } from 'react'
import type { FaqGroup } from '../types'

function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.groupTitle}>
          <h3 className="font-serif text-xl font-semibold text-white mb-4">{group.groupTitle}</h3>
          <div className="divide-y divide-neutral-800 border-y border-neutral-800">
            {group.items.map((item, index) => {
              const key = `${group.groupTitle}-${index}`
              const isOpen = openKey === key
              return (
                <div key={key}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between py-4 text-left"
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4 text-left text-sm font-medium text-white sm:text-base">{item.question}</span>
                    <span className="shrink-0 text-xl text-brand-primary">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p className="pb-4 text-sm leading-relaxed text-neutral-300">{item.answer}</p>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FaqAccordion
