import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { addCleanup } from './cleanup'
import { lenis } from './smooth-scroll'

function createMetaItem(label: string, value: string) {
  const item = document.createElement('div')
  const labelEl = document.createElement('span')

  labelEl.textContent = label
  item.append(labelEl, value)

  return item
}

export function initProjectDetail() {
  const panel = document.getElementById('project-panel')
  const closeBtn = document.getElementById('project-panel-close')
  const visual = document.getElementById('project-panel-visual')
  const gallery = document.getElementById('project-panel-gallery')

  if (!panel || !closeBtn || !visual || !gallery) return

  let isOpen = false
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches

  const populatePanel = (card: HTMLElement) => {
    const image = card.querySelector<HTMLImageElement>('.card__media img')
    const title = card.getAttribute('data-title') || 'Project Study'
    const loc = card.getAttribute('data-loc') || 'Location'
    const year = card.getAttribute('data-year') || 'Study'
    const imageSrc = image ? image.currentSrc || image.src : ''
    const imageAlt = image ? image.alt : title

    visual.replaceChildren()

    if (imageSrc) {
      const img = document.createElement('img')
      img.src = imageSrc
      img.alt = imageAlt
      visual.append(img)
    }

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

    metaEl?.replaceChildren(
      createMetaItem('Typology', card.getAttribute('data-type') || 'Study'),
      createMetaItem('Status', card.getAttribute('data-status') || 'Concept'),
      createMetaItem('Scale', card.getAttribute('data-scale') || 'TBD'),
      createMetaItem(
        'Materials',
        card.getAttribute('data-materials') || 'Material study',
      ),
    )

    gallery.replaceChildren(
      ...(card.getAttribute('data-images') || '')
        .split('|')
        .filter(Boolean)
        .slice(1)
        .map((src) => {
          const img = document.createElement('img')
          img.src = src
          img.alt = `${title} study image`
          img.loading = 'lazy'
          return img
        }),
    )
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
      '.panel__info > *',
      '.panel__visual img',
      panel,
    ])
    gsap.set(panel, { autoAlpha: 1 })
    gsap.fromTo(
      '.panel__visual img',
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
      '.panel__info > *',
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
      '.panel__info > *',
      '.panel__visual img',
      panel,
    ])
    gsap.to('.panel__info > *', {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: 'power2.in',
    })
    gsap.to('.panel__visual img', {
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
        visual.replaceChildren()
        gallery.replaceChildren()
        lenis.start()
        ScrollTrigger.refresh(true)
      },
    })
  }

  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    const activate = () => openPanel(card)

    card.addEventListener('click', activate)
    addCleanup(() => card.removeEventListener('click', activate))
  })

  closeBtn.addEventListener('click', closePanel)
  addCleanup(() => closeBtn.removeEventListener('click', closePanel))

  const onPanelClick = (e: MouseEvent) => {
    if (e.target === panel) closePanel()
  }
  panel.addEventListener('click', onPanelClick)
  addCleanup(() => panel.removeEventListener('click', onPanelClick))

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closePanel()
  }
  window.addEventListener('keydown', onKeydown)
  addCleanup(() => window.removeEventListener('keydown', onKeydown))
}
