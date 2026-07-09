import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { addCleanup } from './cleanup'
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

  const openMenu = () => setMobileMenuOpen(true)
  const closeMenu = () => setMobileMenuOpen(false)

  mobileMenuOpen?.addEventListener('click', openMenu)
  mobileMenuClose?.addEventListener('click', closeMenu)
  mobileMenuBackdrop?.addEventListener('click', closeMenu)
  addCleanup(() => {
    mobileMenuOpen?.removeEventListener('click', openMenu)
    mobileMenuClose?.removeEventListener('click', closeMenu)
    mobileMenuBackdrop?.removeEventListener('click', closeMenu)
  })

  mobileMenu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    const onLinkClick = () => setMobileMenuOpen(false)
    link.addEventListener('click', onLinkClick)
    addCleanup(() => link.removeEventListener('click', onLinkClick))
  })

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      setMobileMenuOpen(false)
    }
  }
  document.addEventListener('keydown', onKeydown)
  addCleanup(() => document.removeEventListener('keydown', onKeydown))
}
