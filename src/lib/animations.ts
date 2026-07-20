import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { addCleanup } from "./cleanup";
import { mm } from "./globals";
import {
  initLineReveals,
  initParallax,
  initScrollStory,
  refreshScrollStory,
} from "./scroll-story";
import { lenis, updateScrollState } from "./smooth-scroll";

let pageScrollInitialized = false;
let homepageMotionInitialized = false;
let heroEasesInitialized = false;

function initHeroEases() {
  if (heroEasesInitialized) return;

  gsap.registerPlugin(CustomEase);
  CustomEase.create("preloaderEase", "0.48,0.00,0.83,0.83");
  CustomEase.create("headerEase", "0.17,0.17,0.52,1.00");
  CustomEase.create("titleEase", "0.17,0.17,0.49,1.00");
  CustomEase.create("titleEaseHide", "0.55,0.00,0.83,0.83");
  CustomEase.create("revealEase", "0.16,1,0.3,1");
  heroEasesInitialized = true;
}

function scheduleScrollRefresh() {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh(true);
    updateScrollState();
  });
}

function initHeroCollectionTransition() {
  initHeroEases();

  const banner = document.querySelector<HTMLElement>(".banner");
  const collection = document.querySelector<HTMLElement>(".collection");
  const philosophy = document.querySelector<HTMLElement>(".philosophy");
  const slider = document.querySelector<HTMLElement>(".slider");
  const sliderItems = gsap.utils.toArray<HTMLElement>(".slider-img");
  const sliderImages = gsap.utils.toArray<HTMLImageElement>(".slider-img img");
  const header = document.querySelector<HTMLElement>(".header");
  const menuTrigger = document.querySelector<HTMLElement>(
    ".header-menu-trigger",
  );
  const menuIcon = document.querySelector<SVGSVGElement>(
    ".header-menu-trigger__icon, [data-header-menu-button-icon]",
  );
  const menuIconPaths = gsap.utils.toArray<SVGPathElement>(
    ".header-menu-trigger__icon path, [data-header-menu-button-icon] path",
  );
  // Kill any leftover GSAP filter / fill fighting CSS
  if (menuIcon) gsap.set(menuIcon, { clearProps: "filter,color,fill" });
  if (menuIconPaths.length) {
    gsap.set(menuIconPaths, {
      clearProps: "fill",
      attr: { fill: "currentColor" },
    });
  }

  let isHeaderOnDark = false;
  const setHeaderOnDark = (onDark: boolean) => {
    if (isHeaderOnDark === onDark) return;
    isHeaderOnDark = onDark;
    document.body.classList.toggle("is-header-on-dark", onDark);
    menuTrigger?.classList.toggle("is-on-dark", onDark);

  };

  if (!banner || !collection || !slider || sliderItems.length === 0) {
    return null;
  }

  const syncHeaderColor = () => {
    const headerLine = (header?.getBoundingClientRect().height ?? 72) * 0.5;
    const bannerRect = banner.getBoundingClientRect();
    const collectionRect = collection.getBoundingClientRect();
    const philosophyRect = philosophy?.getBoundingClientRect();
    const collectionIsBehindHeader =
      collectionRect.top <= headerLine && collectionRect.bottom > headerLine;
    const bannerIsBehindHeader =
      bannerRect.top <= headerLine && bannerRect.bottom > headerLine;
    const philosophyIsBehindHeader =
      philosophyRect !== undefined &&
      philosophyRect.top <= headerLine &&
      philosophyRect.bottom > headerLine;

    setHeaderOnDark(
      bannerIsBehindHeader || collectionIsBehindHeader || philosophyIsBehindHeader,
    );
  };

  gsap.set(collection, {
    padding: 0,
  });
  gsap.set(slider, {
    borderRadius: 0,
    clipPath: "inset(0)",
    yPercent: 0,
  });
  gsap.set(".banner-mask, .collection-mask", { opacity: 0 });
  if (sliderImages.length) {
    gsap.set(sliderImages, {
      scale: 1.3,
      transformOrigin: "50% 50%",
    });
  }
  gsap.set(sliderItems, { autoAlpha: 0, transition: "none" });
  gsap.set(sliderItems[0], { autoAlpha: 1, zIndex: 1 });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: banner,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: syncHeaderColor,
      onLeave: () => {
        ensureCollectionFullscreen();
        syncHeaderColor();
      },
    },
  });

  if (sliderImages.length) {
    timeline.to(
      sliderImages,
      {
        scale: 1,
        duration: 1,
      },
      0,
    );
  }

  timeline.to(
    [".banner-mask", ".collection-mask"],
    {
      opacity: 1,
      duration: 1,
    },
    0,
  );

  function ensureCollectionFullscreen() {
    gsap.set(collection, { padding: 0 });
    gsap.set(slider, {
      borderRadius: 0,
      clipPath: "inset(0 round 0px)",
    });
    if (sliderImages.length) gsap.set(sliderImages, { scale: 1 });
    gsap.set([".banner-mask", ".collection-mask"], { opacity: 1 });
    setHeaderOnDark(true);
  }

  // Only restore dark header chrome once philosophy is in view
  const resetHeaderTrigger = ScrollTrigger.create({
    trigger: ".philosophy",
    start: "top top",
    onToggle: syncHeaderColor,
    onUpdate: syncHeaderColor,
  });

  syncHeaderColor();

  return {
    destroy: () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      resetHeaderTrigger.kill();
      setHeaderOnDark(false);
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initMaskReveal(selector: string) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((media) => {
    const image = media.querySelector("img");

    gsap.set(media, {
      clipPath: "inset(16% 0% 16% 0%)",
      willChange: "clip-path",
    });

    if (image) {
      gsap.set(image, {
        scale: 1.14,
        willChange: "transform",
      });
    }

    const timeline = gsap
      .timeline({
        scrollTrigger: {
          trigger: media,
          start: "top 82%",
          once: true,
        },
      })
      .to(media, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.15,
        ease: "power3.out",
      });

    if (image) {
      timeline.to(
        image,
        {
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        },
        0,
      );
    }
  });
}

function initRevealGroup({
  trigger,
  items,
  y = 44,
  stagger = 0.065,
}: {
  trigger: string;
  items: string;
  y?: number;
  stagger?: number;
}) {
  const targets = gsap.utils.toArray<HTMLElement>(items);
  if (!targets.length) return;

  gsap.fromTo(
    targets,
    {
      y,
      autoAlpha: 0,
      clipPath: "inset(10% 0% 0% 0%)",
    },
    {
      y: 0,
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.95,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    },
  );
}

function initFooterMotion() {
  gsap.fromTo(
    ".footer",
    {
      yPercent: 6,
    },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".footer",
        start: "top bottom",
        end: "top center",
        scrub: 1,
      },
    },
  );
}

function initHomepageMotion() {
  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.set(
        [
          ".featured-project__media",
          ".featured-project__content > *",
          '[data-animate="philosophy-line"]',
          ".project-card",
          '[data-animate="process-step"]',
          ".architect-about__image",
          ".architect-about__content > *",
          ".footer",
        ],
        {
          clearProps: "all",
          autoAlpha: 1,
        },
      );

      return;
    }

    initFooterMotion();
    initLineReveals();
    initScrollStory();
    initParallax();
    refreshScrollStory();

    initMaskReveal(".project-card__media");

    initRevealGroup({
      trigger: ".process",
      items: ".process__eyebrow, .process__intro > *",
    });
  });

  return () => ctx.revert();
}

function initHomepageScrollStory() {
  if (homepageMotionInitialized) return;
  homepageMotionInitialized = true;

  const cleanupHomepageMotion = initHomepageMotion();

  addCleanup(() => {
    cleanupHomepageMotion();
    homepageMotionInitialized = false;
  });
}

function initScrollAnimations() {
  mm.add("(min-width: 0px)", () => {
    const heroAnimation = initHeroCollectionTransition();

    return () => {
      heroAnimation?.destroy();

      document.body.classList.remove("is-hero-pinned", "is-header-on-dark");
      gsap.set(
        [
          ".banner-mask",
          ".collection",
          ".slider",
          ".slider-img",
          ".slider-img img",
          ".collection-mask",
          ".slider-title__item",
          ".header",
          ".header-wrapp",
          ".header-link",
        ],
        { clearProps: "all" },
      );
    };
  });
}

export function initPageScroll() {
  if (pageScrollInitialized) return;
  pageScrollInitialized = true;

  initScrollAnimations();

  scheduleScrollRefresh();

  if (document.readyState === "complete") {
    scheduleScrollRefresh();
  } else {
    window.addEventListener("load", scheduleScrollRefresh, { once: true });
    addCleanup(() => window.removeEventListener("load", scheduleScrollRefresh));
  }

  addCleanup(() => {
    pageScrollInitialized = false;
  });
}

function initProjectCardHover() {
  mm.add("(min-width: 769px)", () => {
    const cleanups = gsap.utils
      .toArray<HTMLElement>(".project-card")
      .map((card) => {
        const media = card.querySelector<HTMLElement>(".project-card__media");
        const image = card.querySelector<HTMLImageElement>(
          ".project-card__media img",
        );
        const caption = card.querySelector<HTMLElement>(".project-card__label");
        const xTo = gsap.quickTo(card, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(card, "y", {
          duration: 0.45,
          ease: "power3.out",
        });
        const rotateXTo = gsap.quickTo(card, "rotationX", {
          duration: 0.55,
          ease: "power3.out",
        });
        const rotateYTo = gsap.quickTo(card, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        });
        const imgXTo = image
          ? gsap.quickTo(image, "xPercent", {
              duration: 0.6,
              ease: "power3.out",
            })
          : null;

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          xTo(relX * 14);
          yTo(relY * 14);
          rotateXTo(relY * -4);
          rotateYTo(relX * 5);
          imgXTo?.(relX * -4);

          if (media) {
            gsap.to(media, {
              "--spot-x": `${(relX + 0.5) * 100}%`,
              "--spot-y": `${(relY + 0.5) * 100}%`,
              "--spot-opacity": 1,
              duration: 0.28,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const onEnter = () => {
          gsap.set(card, { transformPerspective: 900 });
          if (caption) {
            gsap.to(caption, {
              x: 10,
              color: "var(--fg)",
              duration: 0.42,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
          rotateXTo(0);
          rotateYTo(0);
          imgXTo?.(0);
          if (media) {
            gsap.to(media, {
              "--spot-opacity": 0,
              duration: 0.34,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (caption) {
            gsap.to(caption, {
              x: 0,
              color: "var(--muted)",
              duration: 0.38,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);

        return () => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          gsap.set([card, media, caption].filter(Boolean), {
            clearProps: "transform,color",
          });
        };
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

function initMagneticButtons() {
  mm.add("(min-width: 769px)", () => {
    const cleanups = gsap.utils
      .toArray<HTMLElement>("[data-magnetic]:not(.btn)")
      .map((button) => {
        const isHeaderControl = button.matches(".header-contact, .header-cart");
        const magneticX = isHeaderControl ? 0.3 : 0.16;
        const magneticY = isHeaderControl ? 0.38 : 0.22;
        const xTo = gsap.quickTo(button, "x", {
          duration: 0.45,
          ease: "power3.out",
        });

        const yTo = gsap.quickTo(button, "y", {
          duration: 0.45,
          ease: "power3.out",
        });

        const onMove = (event: MouseEvent) => {
          const menuOpen = document.body.classList.contains("is-menu-open");
          const isMenuTrigger =
            button.classList.contains("header-menu-trigger") ||
            button.querySelector(".header-menu-trigger") !== null;
          if (menuOpen && !isMenuTrigger) {
            xTo(0);
            yTo(0);
            return;
          }

          const rect = button.getBoundingClientRect();
          const relX = event.clientX - rect.left - rect.width / 2;
          const relY = event.clientY - rect.top - rect.height / 2;

          xTo(relX * magneticX);
          yTo(relY * magneticY);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        button.addEventListener("mousemove", onMove);
        button.addEventListener("mouseleave", onLeave);

        return () => {
          button.removeEventListener("mousemove", onMove);
          button.removeEventListener("mouseleave", onLeave);
          gsap.set(button, { clearProps: "transform" });
        };
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

export function initAnimations() {
  initProjectCardHover();
  initMagneticButtons();
}

let loaderTimeline: gsap.core.Timeline | null = null;
let loaderFailsafe: number | undefined;
let loaderRaf: number | undefined;
let loaderSession = 0;
let loaderFinished = false;

export function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const session = ++loaderSession;
  const isCurrent = () => session === loaderSession && !loaderFinished;
  const imageWrapper = loader.querySelector<HTMLElement>(
    "[data-loader-images]",
  );
  const imageElements = gsap.utils.toArray<HTMLElement>(
    ".stack-loader__image",
    loader,
  );
  const headingElements = gsap.utils.toArray<HTMLElement>(
    "[data-loader-heading]",
    loader,
  );
  const description = loader.querySelector<HTMLElement>(
    "[data-loader-description]",
  );
  const loaderStatus = document.getElementById("loaderStatus");
  const heroFadeElements = gsap.utils.toArray<HTMLElement>(".banner-reveal");
  const headerWrap = document.querySelector<HTMLElement>(".header-wrapp");
  const headerTargets = headerWrap ? [headerWrap] : [];

  if (!imageWrapper || headingElements.length !== 2 || !description) return;

  loaderFinished = false;
  loaderTimeline?.kill();

  if (loaderFailsafe !== undefined) {
    window.clearTimeout(loaderFailsafe);
    loaderFailsafe = undefined;
  }
  if (loaderRaf !== undefined) {
    window.cancelAnimationFrame(loaderRaf);
    loaderRaf = undefined;
  }

  loader.style.display = "flex";
  loader.style.pointerEvents = "auto";
  loader.setAttribute("aria-busy", "true");
  if (loaderStatus) loaderStatus.textContent = "Loading portfolio";

  lenis.stop();
  initHeroEases();

  gsap.set(heroFadeElements, { yPercent: 110 });
  gsap.set(headerTargets, { y: -32 });
  gsap.set(loader, { display: "flex", autoAlpha: 1 });
  gsap.set(imageWrapper, { yPercent: 500, autoAlpha: 0 });
  gsap.set(imageElements, { autoAlpha: 0 });
  gsap.set(headingElements, { autoAlpha: 0 });
  gsap.set(description, { autoAlpha: 1 });

  const headingSplits = headingElements.map((element) =>
    SplitText.create(element, { type: "words" }),
  );
  const descriptionSplit = SplitText.create(description, {
    type: "words,lines",
  });
  const headingWords = headingSplits.flatMap((split) => split.words);
  const animatedTextTargets = [
    ...headingWords,
    ...descriptionSplit.lines,
  ];

  gsap.set(animatedTextTargets, {
    rotateX: 90,
    autoAlpha: 0,
    transformPerspective: 1000,
    transformOrigin: "50% 100%",
    willChange: "transform,opacity",
  });
  gsap.set(
    imageElements,
    {
      zIndex: (index: number) => index,
    },
  );

  const finish = () => {
    if (!isCurrent()) return;

    loaderFinished = true;
    if (loaderFailsafe !== undefined) {
      window.clearTimeout(loaderFailsafe);
      loaderFailsafe = undefined;
    }

    loader.setAttribute("aria-busy", "false");
    loader.style.pointerEvents = "none";
    loader.style.display = "none";
    document.documentElement.classList.remove("is-loading");

    const revealTimeline = gsap.timeline({
      onComplete: () => {
        if (session !== loaderSession) return;

        gsap.set(heroFadeElements, {
          yPercent: 0,
          clearProps: "transform",
        });
        gsap.set(headerTargets, { y: 0, clearProps: "transform" });

        lenis.scrollTo(0, { immediate: true });
        lenis.start();
        initHomepageScrollStory();
        initPageScroll();

        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
          refreshScrollStory();
          updateScrollState();
        });
      },
    });

    loaderTimeline = revealTimeline;
    revealTimeline
      .to(headerTargets, {
        y: 0,
        duration: 0.8,
        ease: "headerEase",
      })
      .to(
        heroFadeElements,
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.08,
      );
  };

  const forceFinish = () => {
    loaderTimeline?.kill();
    gsap.set(heroFadeElements, { yPercent: 0, clearProps: "transform" });
    gsap.set(headerTargets, { y: 0, clearProps: "transform" });
    finish();
  };

  const startLoader = () => {
    loaderRaf = undefined;
    if (!isCurrent()) return;

    const timeline = gsap.timeline({
      onComplete: finish,
    });
    loaderTimeline = timeline;

    timeline
      .to(imageWrapper, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power4.out",
      })
      .set(headingElements, { autoAlpha: 1 }, "<")
      .to(
        imageElements,
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power4.out",
        },
        "<",
      )
      .to(
        animatedTextTargets,
        {
          rotateX: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power4.out",
        },
        "<+0.5",
      )
      .to(
        imageElements,
        {
          scale: (index: number) => 1 + index * 0.15,
          yPercent: (index: number) => -(index * 20),
          duration: 1,
          stagger: { each: 0.01, from: "end" },
          ease: "power3.inOut",
        },
        "<",
      )
      .to(
        imageElements,
        {
          scale: 1,
          yPercent: (index: number, _target: Element, elements: Element[]) => {
            if (elements.length === 1) return 0;
            const totalSpread = 110 * (elements.length - 1);
            return -totalSpread / 2 + index * 110;
          },
          duration: 1,
          stagger: { each: 0.01, from: "end" },
          ease: "power3.inOut",
        },
        "+=0.2",
      )
      .to(
        descriptionSplit.lines,
        {
          rotateX: 90,
          transformOrigin: "top center",
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.in",
        },
        "<-0.1",
      )
      .to(headingWords, {
        rotateX: 90,
        transformOrigin: "top center",
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.in",
      })
      .to(
        imageElements,
        {
          autoAlpha: 0,
          duration: 0.8,
          stagger: { each: 0.08, from: "end" },
        },
        "<+0.2",
      )
      .to(loader, {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
  };

  loaderFailsafe = window.setTimeout(forceFinish, 9000);
  loaderRaf = window.requestAnimationFrame(startLoader);

  addCleanup(() => {
    if (session !== loaderSession) return;

    loaderSession += 1;
    loaderTimeline?.kill();
    loaderTimeline = null;

    if (loaderRaf !== undefined) {
      window.cancelAnimationFrame(loaderRaf);
      loaderRaf = undefined;
    }
    if (loaderFailsafe !== undefined) {
      window.clearTimeout(loaderFailsafe);
      loaderFailsafe = undefined;
    }

    headingSplits.forEach((split) => split.revert());
    descriptionSplit.revert();
    loaderFinished = false;
  });
}
