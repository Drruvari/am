import { createLogoEyeHoverTimeline } from './logo-eyes'
import { addCleanup } from './cleanup'

export function initLogoHover() {
  const logo = document.querySelector('.header__logo')
  const svg =
    logo?.querySelector<SVGSVGElement>('.header__logo-svg svg') ??
    logo?.querySelector<SVGSVGElement>('svg')

  if (!logo || !svg) return

  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('header__logo-svg-el')

  const hoverTL = createLogoEyeHoverTimeline(svg, 0.5)
  if (!hoverTL) return

  const onEnter = () => hoverTL.play()
  const onLeave = () => hoverTL.reverse()

  logo.addEventListener('pointerenter', onEnter)
  logo.addEventListener('pointerleave', onLeave)
  addCleanup(() => {
    logo.removeEventListener('pointerenter', onEnter)
    logo.removeEventListener('pointerleave', onLeave)
  })
}
