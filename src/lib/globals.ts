import { gsap } from 'gsap'

export let mm: ReturnType<typeof gsap.matchMedia>
export let desktopQuery: MediaQueryList
export let mobileQuery: MediaQueryList
export let finePointerQuery: MediaQueryList
export let prefersReducedMotionQuery: MediaQueryList

export function initMediaQueries() {
  desktopQuery = window.matchMedia('(min-width: 769px)')
  mobileQuery = window.matchMedia('(max-width: 768px)')
  finePointerQuery = window.matchMedia(
    '(min-width: 769px) and (hover: hover) and (pointer: fine)',
  )
  prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mm = gsap.matchMedia()
}
