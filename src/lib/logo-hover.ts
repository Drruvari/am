import { createLogoEyeHoverTimeline } from './logo-eyes'
import { addCleanup } from './cleanup'

export function initLogoHover() {
  const logo = document.querySelector('.site-header__brand')
  const svg =
    logo?.querySelector<SVGSVGElement>('.site-header__logo svg') ??
    logo?.querySelector<SVGSVGElement>('svg')

  if (!logo || !svg) return

  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('site-header__logo-el')

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
