import { gsap } from 'gsap'
import { mm } from './globals'
import { addCleanup } from './cleanup'

function getButtonHoverTarget(btn: HTMLElement) {
  return btn.querySelector<HTMLElement>('a, button') ?? btn
}

function resetButtonElement(btn: HTMLElement) {
  delete btn.dataset.btnReady
  btn.classList.remove('is-hover')
  btn.querySelector(':scope > .btn__bg')?.remove()
  gsap.set(btn, { clearProps: 'transform' })

  const content = btn.querySelector('.btn__label')
  if (content && !content.querySelector('.text-hover-target')) {
    gsap.set(content, { clearProps: 'transform' })
  }
}

function resetTextHoverElement(originalTarget: HTMLElement, label: string) {
  originalTarget.textContent = label
  originalTarget.classList.remove('text-hover-target', 'is-text-hover')
  delete originalTarget.dataset.textHoverReady
  delete originalTarget.dataset.textHoverLabel

  originalTarget
    .querySelectorAll<HTMLElement>('.text-hover-inner, .text-hover-target')
    .forEach((node) => {
      delete node.dataset.textHoverReady
      delete node.dataset.textHoverLabel
      node.classList.remove('text-hover-target', 'is-text-hover')
      gsap.killTweensOf(node.querySelector('.text-hover-track'))
    })
}

const BUTTON_TEXT_HOVER_TARGETS = [
  '.hero__cta .btn__label > span',
  '.archive-card__label',
  '.project-card__label',
  '.header-link:not(.is-disabled):not(.header-menu-trigger):not(.header-contact)',
  '.site-header__nav-link',
  '.site-header__contact-link > span',
  '.site-header__contact-link .btn__label > span',
  '.site-header__menu-button .btn__label > span',
  '.footer__cta .btn__label > span:first-child',
  '.mobile-menu__close-button .btn__label > span',
  '.footer__nav-link',
  '.footer__bar-link',
  '.project-panel__close-button .btn__label > span',
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
    const originalTarget = target as HTMLElement
    const existingLabel =
      originalTarget.dataset.textHoverLabel ||
      originalTarget.textContent?.trim() ||
      ''

    if (
      originalTarget.dataset.textHoverReady === 'true' ||
      originalTarget.classList.contains('text-hover-target') ||
      originalTarget.querySelector('.text-hover-target')
    ) {
      resetTextHoverElement(originalTarget, existingLabel)
    }

    const el = prepareTextHoverElement(originalTarget)
    el.dataset.textHoverReady = 'true'
    originalTarget.dataset.textHoverReady = 'true'
    el.classList.add('text-hover-target')

    const label = el.textContent?.trim() ?? existingLabel
    if (!label) return
    el.dataset.textHoverLabel = label
    originalTarget.dataset.textHoverLabel = label

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

    const btn = el.closest<HTMLElement>('.btn')
    const trigger =
      (btn ? getButtonHoverTarget(btn) : null) ||
      el.closest<HTMLElement>('a, button') ||
      el
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

    const onMouseEnter = () => setHover(true)
    const onMouseLeave = () => setHover(false)
    const onFocus = () => setHover(true)
    const onBlur = () => setHover(false)

    trigger.addEventListener('mouseenter', onMouseEnter)
    trigger.addEventListener('mouseleave', onMouseLeave)
    trigger.addEventListener('focus', onFocus)
    trigger.addEventListener('blur', onBlur)

    addCleanup(() => {
      window.removeEventListener('resize', measure)
      trigger.removeEventListener('mouseenter', onMouseEnter)
      trigger.removeEventListener('mouseleave', onMouseLeave)
      trigger.removeEventListener('focus', onFocus)
      trigger.removeEventListener('blur', onBlur)
      resetTextHoverElement(originalTarget, label)
    })
  })
}

function initButtons() {
  const buttons = gsap.utils.toArray<HTMLElement>('.btn')

  buttons.forEach((btn) => {
    if (btn.dataset.btnReady === 'true') {
      resetButtonElement(btn)
    }

    btn.dataset.btnReady = 'true'

    const layer = document.createElement('span')
    const body = document.createElement('span')
    const content = btn.querySelector('.btn__label')
    const interactive = getButtonHoverTarget(btn)

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

    const onMouseEnter = () => setHover(true)
    const onMouseLeave = () => setHover(false)
    const onFocus = () => setHover(true)
    const onBlur = () => setHover(false)

    interactive.addEventListener('mouseenter', onMouseEnter)
    interactive.addEventListener('mouseleave', onMouseLeave)
    interactive.addEventListener('focus', onFocus)
    interactive.addEventListener('blur', onBlur)

    addCleanup(() => {
      interactive.removeEventListener('mouseenter', onMouseEnter)
      interactive.removeEventListener('mouseleave', onMouseLeave)
      interactive.removeEventListener('focus', onFocus)
      interactive.removeEventListener('blur', onBlur)
      resetButtonElement(btn)
    })
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
