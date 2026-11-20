import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { mergeContent } from './merge'
import type { SiteContent } from './types'

const ContentContext = createContext<SiteContent>(mergeContent(null))

function loadSavedContent() {
  return fetch('/api/content', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { content?: unknown } | null) => data?.content ?? null)
    .catch(() => null)
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => mergeContent(null))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let ignore = false
    const apply = () => {
      loadSavedContent().then((overlay) => {
        if (ignore) return
        setContent(mergeContent(overlay))
        setReady(true)
      })
    }
    apply()
    const onVisible = () => {
      if (document.visibilityState === 'visible') apply()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      ignore = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    document.title = document.documentElement.dataset.pageTitle || `${content.site.brandName} | ${content.site.tagline}`
  }, [content])

  if (!ready) return <div className="min-h-screen bg-neutral-950" />

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
