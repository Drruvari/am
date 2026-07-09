import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lenis } from './smooth-scroll'

export function initMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu')
  const mobileMenuOpen = document.getElementById('mobileMenuOpen')
  const mobileMenuClose = document.getElementById('mobileMenuClose')
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop')

  const setMobileMenuOpen = (open: boolean) => {
    if (!mobileMenu) return

    mobileMenu.classList.toggle('is-open', open)
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true')
    mobileMenuOpen?.setAttribute('aria-expanded', open ? 'true' : 'false')
    document.body.classList.toggle('is-nav-drawer-open', open)

    if (open) {
      lenis.stop()
    } else {
      lenis.start()
      window.setTimeout(() => ScrollTrigger.refresh(true), 50)
    }
  }

  mobileMenuOpen?.addEventListener('click', () => setMobileMenuOpen(true))
  mobileMenuClose?.addEventListener('click', () => setMobileMenuOpen(false))
  mobileMenuBackdrop?.addEventListener('click', () => setMobileMenuOpen(false))

  mobileMenu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setMobileMenuOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      setMobileMenuOpen(false)
    }
  })
}
