import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lenis } from './smooth-scroll'

export function initProjectDetail() {
  const panel = document.getElementById('project-panel')
  const closeBtn = document.getElementById('project-panel-close')
  const visual = document.getElementById('project-panel-visual')
  const gallery = document.getElementById('project-panel-gallery')

  if (!panel || !closeBtn || !visual || !gallery) return

  let isOpen = false
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches

  const populatePanel = (card: HTMLElement) => {
    const image = card.querySelector<HTMLImageElement>('.project-card__media img')
    const title = card.getAttribute('data-title') || 'Project Study'
    const loc = card.getAttribute('data-loc') || 'Location'
    const year = card.getAttribute('data-year') || 'Study'
    const imageSrc = image ? image.currentSrc || image.src : ''
    const imageAlt = image ? image.alt : title

    visual.innerHTML = imageSrc
      ? `<img src="${imageSrc}" alt="${imageAlt}">`
      : ''
    const titleEl = document.getElementById('project-panel-title')
    const indexEl = document.getElementById('project-panel-index')
    const locationEl = document.getElementById('project-panel-location')
    const descriptionEl = document.getElementById('project-panel-description')
    const metaEl = document.getElementById('project-panel-meta')

    if (titleEl) titleEl.textContent = title
    if (indexEl) indexEl.textContent = card.getAttribute('data-index') || 'A—00'
    if (locationEl) locationEl.textContent = `${loc} — ${year}`
    if (descriptionEl) {
      descriptionEl.textContent = card.getAttribute('data-desc') || ''
    }
    if (metaEl) {
      metaEl.innerHTML = `
      <div><span>Typology</span>${card.getAttribute('data-type') || 'Study'}</div>
      <div><span>Status</span>${card.getAttribute('data-status') || 'Concept'}</div>
      <div><span>Scale</span>${card.getAttribute('data-scale') || 'TBD'}</div>
      <div><span>Materials</span>${card.getAttribute('data-materials') || 'Material study'}</div>
    `
    }
    gallery.innerHTML = (card.getAttribute('data-images') || '')
      .split('|')
      .filter(Boolean)
      .slice(1)
      .map(
        (src) => `<img src="${src}" alt="${title} study image" loading="lazy">`,
      )
      .join('')
  }

  const openPanel = (card: HTMLElement) => {
    if (isOpen) return
    isOpen = true

    populatePanel(card)
    panel.classList.add('is-open')
    document.body.classList.add('is-project-panel-open')
    lenis.stop()

    const imageDuration = isMobile() ? 0.55 : 0.9
    const infoDuration = isMobile() ? 0.45 : 0.68

    gsap.killTweensOf([
      '.project-panel__info > *',
      '.project-panel__visual img',
      panel,
    ])
    gsap.set(panel, { autoAlpha: 1 })
    gsap.fromTo(
      '.project-panel__visual img',
      {
        clipPath: isMobile() ? 'inset(4% 4% 4% 4%)' : 'inset(8% 8% 8% 8%)',
        scale: 1.05,
        opacity: 0.85,
      },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        opacity: 1,
        duration: imageDuration,
        ease: 'power4.out',
      },
    )
    gsap.fromTo(
      '.project-panel__info > *',
      { opacity: 0, y: isMobile() ? 16 : 26 },
      {
        opacity: 1,
        y: 0,
        stagger: isMobile() ? 0.04 : 0.07,
        duration: infoDuration,
        ease: 'power3.out',
        delay: isMobile() ? 0.06 : 0.12,
      },
    )
  }

  const closePanel = () => {
    if (!isOpen) return

    gsap.killTweensOf([
      '.project-panel__info > *',
      '.project-panel__visual img',
      panel,
    ])
    gsap.to('.project-panel__info > *', {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: 'power2.in',
    })
    gsap.to('.project-panel__visual img', {
      scale: 1.02,
      opacity: 0,
      duration: 0.32,
      ease: 'power3.inOut',
    })
    gsap.to(panel, {
      autoAlpha: 0,
      duration: 0.36,
      ease: 'power3.inOut',
      onComplete: () => {
        isOpen = false
        panel.classList.remove('is-open')
        document.body.classList.remove('is-project-panel-open')
        visual.innerHTML = ''
        gallery.innerHTML = ''
        lenis.start()
        ScrollTrigger.refresh(true)
      },
    })
  }

  document.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
    card.setAttribute('role', 'button')
    card.setAttribute('tabindex', '0')

    const activate = () => openPanel(card)

    card.addEventListener('click', activate)
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        activate()
      }
    })
  })

  closeBtn.addEventListener('click', closePanel)
  panel.addEventListener('click', (e) => {
    if (e.target === panel) closePanel()
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel()
  })
}
