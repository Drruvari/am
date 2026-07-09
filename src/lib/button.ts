import { gsap } from 'gsap'
import { mm } from './globals'

const BUTTON_TEXT_HOVER_TARGETS = [
  '.hero__cta .btn__label > span',
  '.archive-card__label',
  '.project-card__label',
  '.site-header__nav a',
  '.site-header__contact-link .btn__label > span',
  '.site-header__menu-btn .btn__label > span',
  '.footer__cta-link .btn__label > span:first-child',
  '.nav-drawer__close .btn__label > span',
  '.footer-nav-links a',
  '.footer-bar a',
  '.project-panel__close .btn__label > span',
]

function prepareTextHoverElement(el: HTMLElement) {
  if (el.classList.contains('text-hover-target')) return el

  const styles = getComputedStyle(el)
  const needsInnerWrapper =
    el.matches('a, button') ||
    el.classList.contains('archive-card__label') ||
    el.classList.contains('project-card__label') ||
    styles.display === 'flex' ||
    parseFloat(styles.paddingTop) > 0 ||
    parseFloat(styles.paddingBottom) > 0

  if (!needsInnerWrapper) return el

  const wrapper = document.createElement('span')
  wrapper.className = 'text-hover-inner'
  wrapper.textContent = el.textContent?.trim() ?? ''
  el.replaceChildren(wrapper)
  return wrapper
}

function initTextHoverEffects(selectors: string[] = BUTTON_TEXT_HOVER_TARGETS) {
  document.querySelectorAll(selectors.join(',')).forEach((target) => {
    const el = prepareTextHoverElement(target as HTMLElement)
    if (el.dataset.textHoverReady === 'true') return
    el.dataset.textHoverReady = 'true'
    el.classList.add('text-hover-target')

    const label = el.textContent?.trim() ?? ''
    if (!label) return
    el.dataset.textHoverLabel = label

    const track = document.createElement('span')
    const current = document.createElement('span')
    const next = document.createElement('span')

    track.className = 'text-hover-track'
    current.className = 'text-hover-line'
    next.className = 'text-hover-line'
    next.setAttribute('aria-hidden', 'true')
    current.textContent = label
    next.textContent = label
    track.append(current, next)
    el.replaceChildren(track)

    let lineShift = 0
    const measure = () => {
      lineShift = current.getBoundingClientRect().height
      if (el.classList.contains('is-text-hover')) {
        gsap.set(track, { y: -lineShift })
      }
    }

    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)

    const trigger =
      el.closest('.btn') || el.closest('a, button') || el
    const setHover = (active: boolean) => {
      measure()
      el.classList.toggle('is-text-hover', active)
      gsap.to(track, {
        y: active ? -lineShift : 0,
        duration: active ? 0.46 : 0.38,
        ease: active ? 'power4.out' : 'power3.inOut',
        overwrite: 'auto',
      })
    }

    trigger.addEventListener('mouseenter', () => setHover(true))
    trigger.addEventListener('mouseleave', () => setHover(false))
    trigger.addEventListener('focus', () => setHover(true))
    trigger.addEventListener('blur', () => setHover(false))
  })
}

function initButtons() {
  const buttons = gsap.utils.toArray<HTMLElement>('.btn')

  buttons.forEach((btn) => {
    if (btn.dataset.btnReady === 'true') return
    btn.dataset.btnReady = 'true'

    const layer = document.createElement('span')
    const body = document.createElement('span')
    const content = btn.querySelector('.btn__label')
    const interactive = btn.querySelector('a, button')

    layer.className = 'btn__bg'
    body.className = 'btn__surface'
    layer.setAttribute('aria-hidden', 'true')
    layer.append(body)
    btn.prepend(layer)

    const setHover = (active: boolean) => {
      btn.classList.toggle('is-hover', active)
      gsap.to(body, {
        scale: active ? 1.03 : 1,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      if (content && !content.querySelector('.text-hover-target')) {
        gsap.to(content, {
          y: active ? -1 : 0,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    btn.addEventListener('mouseenter', () => setHover(true))
    btn.addEventListener('mouseleave', () => setHover(false))
    interactive?.addEventListener('focus', () => setHover(true))
    interactive?.addEventListener('blur', () => setHover(false))
  })

  mm.add('(min-width: 769px) and (pointer: fine)', () => {
    const MAGNET_STRENGTH = 0.24
    const TEXT_FOLLOW_STRENGTH = 0.32

    const cleanups = buttons.map((btn) => {
      const content = btn.querySelector('.btn__label')
      const textTrack = content?.querySelector('.text-hover-track')
      const textTarget = textTrack || content
      const isHeaderBtn = btn.closest('.site-header')
      const magnetStrength = isHeaderBtn ? 0.18 : MAGNET_STRENGTH
      const textStrength = isHeaderBtn ? 0.28 : TEXT_FOLLOW_STRENGTH

      const btnXTo = gsap.quickTo(btn, 'x', {
        duration: 0.42,
        ease: 'power3.out',
      })
      const btnYTo = gsap.quickTo(btn, 'y', {
        duration: 0.42,
        ease: 'power3.out',
      })
      const labelXTo = textTarget
        ? gsap.quickTo(textTarget, 'x', { duration: 0.34, ease: 'power3.out' })
        : null
      const labelYTo = textTarget
        ? gsap.quickTo(textTarget, 'y', { duration: 0.34, ease: 'power3.out' })
        : null

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        btnXTo(x * magnetStrength)
        btnYTo(y * magnetStrength)

        if (labelXTo) {
          const textOffset = textTrack
            ? textStrength - magnetStrength
            : textStrength

          labelXTo(x * textOffset)

          if (!textTrack && labelYTo) {
            labelYTo(y * textOffset)
          }
        }
      }

      const onLeave = () => {
        btnXTo(0)
        btnYTo(0)
        labelXTo?.(0)
        if (!textTrack) {
          labelYTo?.(0)
        }
      }

      btn.addEventListener('mousemove', onMove)
      btn.addEventListener('mouseleave', onLeave)
      return () => {
        btn.removeEventListener('mousemove', onMove)
        btn.removeEventListener('mouseleave', onLeave)
        gsap.set([btn, content, textTarget].filter(Boolean), {
          clearProps: 'transform',
        })
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  })
}

export function initButtonSystem() {
  initButtons()
  initTextHoverEffects()
}
