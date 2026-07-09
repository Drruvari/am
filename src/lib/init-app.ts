import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { addCleanup, runCleanups } from './cleanup'
import { initMediaQueries, mm } from './globals'
import { initSmoothScroll, resetScrollLock, updateScrollState } from './smooth-scroll'
import { initButtonSystem } from './button'
import { initAnimations, initLoader } from './animations'
import { initLogoHover } from './logo-hover'
import { initMobileMenu } from './mobile-menu'
import { initProjectDetail } from './project-detail'

let appInitialized = false

function initGlobalUI() {
  const footerYear = document.getElementById('footerYear')
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear())
  }

  const footerStatus = document.getElementById('footerStatus')
  const updateFooterStatus = () => {
    if (!footerStatus) return

    const now = new Date()
    const time = now.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Europe/Tirane',
      timeZoneName: 'short',
    })
    const hour = Number(
      now.toLocaleString('en-AU', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'Europe/Tirane',
      }),
    )
    const isOpen = hour >= 8 && hour < 17
    footerStatus.textContent = `${time}, we are ${isOpen ? 'open' : 'closed'}`
  }

  updateFooterStatus()
  const footerStatusInterval = window.setInterval(updateFooterStatus, 60_000)
  addCleanup(() => window.clearInterval(footerStatusInterval))

  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      ScrollTrigger.refresh()
      updateScrollState()
    }
  }
  window.addEventListener('pageshow', onPageShow)
  addCleanup(() => window.removeEventListener('pageshow', onPageShow))

  const onLoad = () => {
    ScrollTrigger.refresh()
    updateScrollState()
  }
  window.addEventListener('load', onLoad)
  addCleanup(() => window.removeEventListener('load', onLoad))

  const onResize = () => {
    updateScrollState()
  }
  window.addEventListener('resize', onResize)
  addCleanup(() => window.removeEventListener('resize', onResize))

  let orientationTimeout: number | undefined
  const onOrientationChange = () => {
    if (orientationTimeout !== undefined) {
      window.clearTimeout(orientationTimeout)
    }
    orientationTimeout = window.setTimeout(() => {
      orientationTimeout = undefined
      ScrollTrigger.refresh()
      updateScrollState()
    }, 300)
  }
  window.addEventListener('orientationchange', onOrientationChange)
  addCleanup(() => {
    window.removeEventListener('orientationchange', onOrientationChange)
    if (orientationTimeout !== undefined) {
      window.clearTimeout(orientationTimeout)
    }
  })
}

export function disposeApp() {
  runCleanups()

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  gsap.killTweensOf('*')
  mm?.revert()
  document.documentElement.classList.remove('is-loading')
  resetScrollLock()
  document.body.classList.remove(
    'is-menu-open',
    'is-project-panel-open',
    'is-header-compact',
    'is-hero-pinned',
    'has-custom-cursor',
  )
  gsap.set(
    '.hero__meta span, .hero__lede, .hero__cta, .hero__media, .hero__title .char, .hero__img',
    { clearProps: 'all' },
  )
  const loader = document.getElementById('loader')
  if (loader) {
    gsap.set(loader, { clearProps: 'all' })
    loader.style.pointerEvents = 'none'
  }
  appInitialized = false
}

export function initApp() {
  if (appInitialized) return
  if (!document.getElementById('loader')) return

  appInitialized = true

  gsap.registerPlugin(ScrollTrigger)

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  window.scrollTo(0, 0)
  resetScrollLock()
  document.documentElement.classList.add('is-loading')

  initMediaQueries()

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  })

  initSmoothScroll()
  initButtonSystem()
  initAnimations()
  initLoader()
  initLogoHover()
  initMobileMenu()
  initProjectDetail()
  initGlobalUI()
}
