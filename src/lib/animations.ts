import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { mm } from './globals'
import { addCleanup } from './cleanup'
import { lenis } from './smooth-scroll'
import { updateScrollState } from './smooth-scroll'
import {
  addLogoEyeReveal,
  getLogoEyeElements,
  resetLogoEye,
} from './logo-eyes'

let pageScrollInitialized = false
let verticalMiddleContext: gsap.Context | undefined

function scheduleScrollRefresh() {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh(true)
    updateScrollState()
  })
}

function initHeroHandoff({
  hero,
  heroContainer,
  heroImage,
  heroShell,
}: {
  hero: Element
  heroContainer: Element
  heroImage: Element
  heroShell: Element
}) {
  const heroText = gsap.utils.toArray<HTMLElement>('.hero__meta, .hero__content')
  heroText.forEach((el) => {
    el.style.overflow = 'hidden'
  })

  const getHeroBleed = () =>
    parseFloat(getComputedStyle(hero).paddingLeft) || 0

  gsap.set(heroImage, { scale: 1, transformOrigin: '50% 100%' })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=90%',
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        document.body.classList.toggle('is-hero-pinned', self.isActive)
      },
    },
  })

  timeline
    .to(
      heroText,
      {
        yPercent: -14,
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: 'power2.in',
        duration: 0.7,
      },
      0,
    )
    .to(heroContainer, { gap: 0, ease: 'power2.in', duration: 0.7 }, 0)
    .fromTo(
      heroShell,
      { flexGrow: 0 },
      { flexGrow: 1, ease: 'power2.inOut', duration: 1 },
      0,
    )
    .to(
      heroShell,
      {
        '--hero-media-bleed': () => `${getHeroBleed()}px`,
        ease: 'power2.inOut',
        duration: 0.45,
      },
      0,
    )

  return timeline
}

function initVerticalMiddleScroll() {
  verticalMiddleContext?.revert()

  verticalMiddleContext = gsap.context(() => {
    gsap.set('.manifesto__image', { clearProps: 'width' })

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const revealGroups = [
      {
        trigger: '.manifesto',
        items: '.manifesto__eyebrow, .manifesto__line',
        y: 48,
        stagger: 0.08,
      },
      {
        trigger: '.archive',
        items: '.archive__intro > *, .archive-card',
        y: 56,
        stagger: 0.08,
      },
      {
        trigger: '.projects',
        items: '.projects__intro > *, .project-card',
        y: 64,
        stagger: 0.08,
      },
      {
        trigger: '.footer',
        items: '.footer-hero > *, .footer-grid > *, .footer-bar > *',
        y: 48,
        stagger: 0.06,
      },
    ]

    revealGroups.forEach(({ trigger, items, y, stagger }) => {
      const section = document.querySelector(trigger)
      const targets = gsap.utils.toArray(items)

      if (!section || !targets.length) return

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        stagger,
        ease: 'power4.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      })
    })

    if (prefersReducedMotion) return

    const parallaxItems = [
      '.manifesto__image img',
      '.archive-card img',
      '.project-card__media img',
      '.footer-image-block img',
    ]

    gsap.utils.toArray<HTMLImageElement>(parallaxItems.join(',')).forEach((img) => {
      const trigger =
        img.closest('.archive-card') ||
        img.closest('.project-card') ||
        img.closest('.manifesto__line') ||
        img.closest('.footer-image-block') ||
        img

      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('.archive-card, .project-card').forEach((item) => {
      gsap.fromTo(
        item,
        { y: 42 },
        {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      )
    })
  })
}

function initScrollAnimations() {
  mm.add('(min-width: 769px)', () => {
    const hero = document.querySelector('.hero')
    const heroContainer = document.querySelector('.hero__body')
    const heroImage = document.querySelector('.hero__img')
    const heroShell = document.querySelector('.hero__media')

    const heroAnimation =
      hero && heroContainer && heroImage && heroShell
        ? initHeroHandoff({ hero, heroContainer, heroImage, heroShell })
        : null

    return () => {
      heroAnimation?.scrollTrigger?.kill()
      heroAnimation?.kill()
      document.body.classList.remove('is-hero-pinned')
      gsap.set(
        [heroContainer, heroShell, heroImage, '.hero__meta', '.hero__content'],
        {
          clearProps:
            'transform,opacity,height,margin,padding,gap,flexGrow,--hero-media-bleed',
        },
      )
      gsap.utils.toArray<HTMLElement>('.hero__meta, .hero__content').forEach((el) => {
        el.style.overflow = ''
      })
    }
  })

  mm.add('(max-width: 768px)', () => {
    document.body.classList.remove('is-hero-pinned')

    return () => {
      document.body.classList.remove('is-hero-pinned')
    }
  })
}

export function initPageScroll() {
  if (pageScrollInitialized) return
  pageScrollInitialized = true

  initScrollAnimations()
  initVerticalMiddleScroll()

  scheduleScrollRefresh()

  if (document.readyState === 'complete') {
    scheduleScrollRefresh()
  } else {
    window.addEventListener('load', scheduleScrollRefresh, { once: true })
    addCleanup(() =>
      window.removeEventListener('load', scheduleScrollRefresh),
    )
  }

  addCleanup(() => {
    pageScrollInitialized = false
  })
}

function initProjectCardHover() {
  mm.add('(min-width: 769px)', () => {
    const cleanups = gsap.utils.toArray<HTMLElement>('.project-card').map((card) => {
      const media = card.querySelector<HTMLElement>('.project-card__media')
      const image = card.querySelector<HTMLImageElement>('.project-card__media img')
      const caption = card.querySelector<HTMLElement>('.project-card__label')
      const xTo = gsap.quickTo(card, 'x', {
        duration: 0.45,
        ease: 'power3.out',
      })
      const yTo = gsap.quickTo(card, 'y', {
        duration: 0.45,
        ease: 'power3.out',
      })
      const rotateXTo = gsap.quickTo(card, 'rotationX', {
        duration: 0.55,
        ease: 'power3.out',
      })
      const rotateYTo = gsap.quickTo(card, 'rotationY', {
        duration: 0.55,
        ease: 'power3.out',
      })
      const imgXTo = image
        ? gsap.quickTo(image, 'xPercent', {
            duration: 0.6,
            ease: 'power3.out',
          })
        : null

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const relX = (e.clientX - rect.left) / rect.width - 0.5
        const relY = (e.clientY - rect.top) / rect.height - 0.5
        xTo(relX * 14)
        yTo(relY * 14)
        rotateXTo(relY * -4)
        rotateYTo(relX * 5)
        imgXTo?.(relX * -4)

        if (media) {
          gsap.to(media, {
            '--spot-x': `${(relX + 0.5) * 100}%`,
            '--spot-y': `${(relY + 0.5) * 100}%`,
            '--spot-opacity': 1,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }

      const onEnter = () => {
        gsap.set(card, { transformPerspective: 900 })
        if (caption) {
          gsap.to(caption, {
            x: 10,
            color: 'var(--fg)',
            duration: 0.42,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
        rotateXTo(0)
        rotateYTo(0)
        imgXTo?.(0)
        if (media) {
          gsap.to(media, {
            '--spot-opacity': 0,
            duration: 0.34,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (caption) {
          gsap.to(caption, {
            x: 0,
            color: 'var(--muted)',
            duration: 0.38,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      return () => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
        gsap.set([card, media, caption].filter(Boolean), {
          clearProps: 'transform,color',
        })
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  })
}

export function initAnimations() {
  initProjectCardHover()
}

let loaderTimeline: gsap.core.Timeline | null = null
let loaderFailsafe: number | undefined
let loaderFinished = false

export function initLoader() {
  const loader = document.getElementById('loader')
  if (!loader) return

  loaderFinished = false
  loaderTimeline?.kill()
  if (loaderFailsafe !== undefined) {
    window.clearTimeout(loaderFailsafe)
  }

  const logoSvg =
    loader.querySelector<SVGSVGElement>('.loader__logo-svg svg') ??
    loader.querySelector<SVGSVGElement>('.loader__logo svg')
  const countValue = loader.querySelector('.loader__progress-value')
  const loaderStatus = document.getElementById('loaderStatus')
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const eyeRevealDuration = prefersReducedMotion ? 0.8 : isMobile ? 1.8 : 3.4
  const eyeElements = logoSvg ? getLogoEyeElements(logoSvg, 'loader-') : null

  if (eyeElements) {
    resetLogoEye(eyeElements)
  }

  lenis.stop()

  const heroLineSplits = gsap.utils
    .toArray<HTMLElement>('.hero__title .line')
    .map((line) => new SplitType(line, { types: 'chars' }))
  const heroHeadlineChars = heroLineSplits.flatMap((split) => split.chars ?? [])

  gsap.set(heroHeadlineChars, {
    yPercent: 100,
    rotation: 10,
    transformOrigin: '0% 100%',
  })
  gsap.set('.hero__meta span, .hero__lede, .hero__cta, .hero__media', {
    y: 24,
    opacity: 0,
  })

  const finish = () => {
    if (loaderFinished) return
    loaderFinished = true

    if (loaderFailsafe !== undefined) {
      window.clearTimeout(loaderFailsafe)
      loaderFailsafe = undefined
    }
    loader.setAttribute('aria-busy', 'false')
    loader.style.pointerEvents = 'none'
    lenis.scrollTo(0, { immediate: true })
    lenis.start()
    ScrollTrigger.refresh(true)
    initPageScroll()
    updateScrollState()
  }

  const revealHero = () => {
    document.documentElement.classList.remove('is-loading')
    gsap.set('.hero__img', { scale: 1, transformOrigin: '50% 100%' })
  }

  const updateDrawProgress = (progressRatio: number) => {
    const progress = Math.min(100, Math.round(progressRatio * 100))

    if (countValue) {
      countValue.textContent = String(progress)
    }

    if (loaderStatus) {
      loaderStatus.textContent = `Loading, ${progress} percent`
    }
  }

  const runLoaderTimeline = () => {
    const loaderTL = gsap.timeline()
    loaderTimeline = loaderTL

    loaderTL
      .to(
        '.loader__tagline span',
        {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        0,
      )
      .to(
        '.loader__progress',
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        0.08,
      )

    if (eyeElements) {
      addLogoEyeReveal(loaderTL, eyeElements, {
        duration: eyeRevealDuration,
        position: 0,
        onProgress: updateDrawProgress,
      })
    } else if (countValue) {
      countValue.textContent = '100'
    }

    loaderTL
      .to({}, { duration: 0.3 })
      .to(
        '.loader__meta',
        {
          y: -18,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
        },
        '>-0.1',
      )
      .to(
        '.loader__progress',
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
        },
        '<',
      )
      .to(
        '.loader__logo',
        {
          opacity: 0,
          scale: 0.98,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '<',
      )
      .to(
        '.loader',
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.9,
          ease: 'power4.inOut',
        },
        '<0.15',
      )
      .call(revealHero, undefined, '>')
      .to(heroHeadlineChars, {
        yPercent: 0,
        rotation: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.02,
      })
      .to(
        '.hero__meta span, .hero__lede, .hero__cta, .hero__media',
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
        },
        '<0.1',
      )
      .call(finish, undefined, '>')
  }

  const startLoader = () => runLoaderTimeline()

  loaderFailsafe = window.setTimeout(() => {
    if (!document.documentElement.classList.contains('is-loading')) return
    revealHero()
    gsap.set(heroHeadlineChars, { clearProps: 'all' })
    gsap.set('.hero__meta span, .hero__lede, .hero__cta, .hero__media', {
      clearProps: 'all',
      opacity: 1,
      y: 0,
    })
    gsap.set(loader, { clearProps: 'all', pointerEvents: 'none' })
    finish()
  }, 12000)

  if (document.fonts?.ready) {
    document.fonts.ready.then(startLoader).catch(startLoader)
  } else {
    startLoader()
  }

  addCleanup(() => {
    loaderTimeline?.kill()
    if (loaderFailsafe !== undefined) {
      window.clearTimeout(loaderFailsafe)
      loaderFailsafe = undefined
    }
    loaderFinished = false
  })
}
