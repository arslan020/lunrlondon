import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { mergeContent } from './merge'
import type { SiteContent } from './types'

const ContentContext = createContext<SiteContent>(mergeContent(null))

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => mergeContent(null))

  useEffect(() => {
    let ignore = false
    fetch('/api/content')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { content?: unknown } | null) => {
        if (!ignore && data) setContent(mergeContent(data.content))
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    document.title = `${content.site.brandName} | ${content.site.tagline}`
  }, [content])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
