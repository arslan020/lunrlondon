import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useState } from 'react'
import Lenis from 'lenis'
import Header from './Header'
import Footer from './Footer'

let smoothScroll: Lenis | null = null

function revealOnScroll() {
  const main = document.querySelector('main')
  if (!main) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  main.querySelectorAll('.scroll-reveal').forEach((node) => {
    node.classList.remove('scroll-reveal', 'is-in')
    if (node instanceof HTMLElement) node.style.transitionDelay = ''
  })

  const nodes = [...main.querySelectorAll('h1, h2, h3, p, li, a.rounded-full')].filter((node) => {
    if (node.closest('.marquee-up')) return false
    if (node.closest('a.group')) return false
    if (node.closest('.no-reveal')) return false
    return true
  })

  const groups = new Map<Element, HTMLElement[]>()
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    const group = node.closest('section') ?? node
    const list = groups.get(group) ?? []
    list.push(node)
    groups.set(group, list)
  })

  groups.forEach((items) => {
    items.forEach((node, index) => {
      node.classList.add('scroll-reveal')
      node.style.transitionDelay = `${Math.min(index, 8) * 0.16}s`
    })
  })

  const show = (group: Element) => {
    groups.get(group)?.forEach((node) => node.classList.add('is-in'))
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        show(entry.target)
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -40% 0px', threshold: 0 },
  )

  groups.forEach((_items, group) => observer.observe(group))

  const frame = requestAnimationFrame(() => {
    groups.forEach((_items, group) => {
      const top = group.getBoundingClientRect().top
      if (top < window.innerHeight * 0.6) show(group)
    })
  })

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
  }
}

function Layout() {
  const { pathname } = useLocation()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!desktop.matches || reduced.matches) return

    smoothScroll = new Lenis({
      autoRaf: true,
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
    })

    return () => {
      smoothScroll?.destroy()
      smoothScroll = null
    }
  }, [])

  useEffect(() => {
    if (smoothScroll) smoothScroll.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  useLayoutEffect(() => revealOnScroll(), [pathname])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="top" className="relative flex min-h-screen flex-col overflow-x-clip bg-black">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showTop && (
        <a
          href="#top"
          aria-label="Back to top"
          className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg ring-1 ring-white/10 sm:bottom-6 sm:right-6"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M8 3 3 8l1.4 1.4L7 6.8V14h2V6.8l2.6 2.6L13 8z" />
          </svg>
        </a>
      )}
    </div>
  )
}

export default Layout
