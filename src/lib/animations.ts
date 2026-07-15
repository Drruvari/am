import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addCleanup } from "./cleanup";
import { mm } from "./globals";
import {
  FINAL_FLAG,
  FINAL_HEX,
  PLACEHOLDER_FLAG,
  PLACEHOLDER_HEX,
} from "./loader-paths";
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

  const fluidPad = () =>
    getComputedStyle(document.documentElement).getPropertyValue("--u").trim() ||
    "6.9444444444vw";
  const collectionPad = () => `calc(0.22 * ${fluidPad()})`;
  const sliderRadius = () => `calc(0.22 * ${fluidPad()})`;

  const syncHeaderColor = () => {
    const headerLine = (header?.getBoundingClientRect().height ?? 72) * 0.5;
    const collectionRect = collection.getBoundingClientRect();
    const philosophyRect = philosophy?.getBoundingClientRect();
    const collectionIsBehindHeader =
      collectionRect.top <= headerLine && collectionRect.bottom > headerLine;
    const philosophyIsBehindHeader =
      philosophyRect !== undefined &&
      philosophyRect.top <= headerLine &&
      philosophyRect.bottom > headerLine;

    setHeaderOnDark(collectionIsBehindHeader && !philosophyIsBehindHeader);
  };

  gsap.set(collection, {
    paddingLeft: collectionPad(),
    paddingRight: collectionPad(),
  });
  gsap.set(slider, {
    borderRadius: sliderRadius(),
    clipPath: `inset(0 round ${sliderRadius()})`,
    yPercent: 0,
  });
  gsap.set(".banner-mask, .collection-mask", { opacity: 0 });
  gsap.set(sliderImages, {
    scale: 1.3,
    transformOrigin: "50% 50%",
  });
  gsap.set(sliderItems, { autoAlpha: 0, transition: "none" });
  gsap.set(sliderItems[0], { autoAlpha: 1, zIndex: 1 });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: banner,
      start: "top top",
      end: "bottom top",
      scrub: 0.4,
      invalidateOnRefresh: true,
      onUpdate: syncHeaderColor,
      onLeave: () => {
        ensureCollectionFullscreen();
        syncHeaderColor();
      },
    },
  });

  timeline
    .to(
      collection,
      {
        padding: 0,
        duration: 1,
      },
      0,
    )
    .to(
      slider,
      {
        borderRadius: 0,
        clipPath: "inset(0 round 0px)",
        duration: 1,
      },
      0,
    )
    .to(
      sliderImages,
      {
        scale: 1,
        duration: 1,
      },
      0,
    )
    .to(
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
    gsap.set(sliderImages, { scale: 1 });
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
        scrub: 0.45,
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
  const transitionRows = gsap.utils.toArray<HTMLElement>(
    ".loader-transition__row",
  );
  const transitionBlocks = gsap.utils.toArray<HTMLElement>(
    ".loader-transition__block",
  );

  if (!loader) return;

  gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

  const session = ++loaderSession;

  const isActive = () => session === loaderSession && !loaderFinished;

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

  gsap.set(loader, {
    autoAlpha: 1,
    clearProps: "opacity,visibility",
  });

  transitionRows.forEach((row) => {
    const [leftBlock, rightBlock] = Array.from(row.children);
    gsap.set(leftBlock, { xPercent: -101, autoAlpha: 0 });
    gsap.set(rightBlock, { xPercent: 101, autoAlpha: 0 });
  });

  const countValue =
    loader.querySelector<HTMLElement>(".loader__progress-value") ??
    document.getElementById("loaderCount");

  const loaderStatus = document.getElementById("loaderStatus");
  const loaderContent = loader.querySelector<HTMLElement>(".loader__content");
  const progressBar = loader.querySelector<HTMLElement>(
    ".loader__progress-bar",
  );
  const loaderChrome = gsap.utils.toArray<HTMLElement>(
    ".loader__progress, .loader__loading",
  );
  const loadingText = loader.querySelector<HTMLElement>(".loader__loading");
  const mark = loader.querySelector<SVGSVGElement>(".loader__mark");
  const shapeHex = loader.querySelector<SVGPathElement>("#shape-hex");
  const shapeFlag = loader.querySelector<SVGPathElement>("#shape-flag");
  const shapes = [shapeHex, shapeFlag].filter(Boolean) as SVGPathElement[];

  if (shapeHex) {
    shapeHex.setAttribute("d", PLACEHOLDER_HEX);
  }

  if (shapeFlag) {
    shapeFlag.setAttribute("d", PLACEHOLDER_FLAG);
    shapeFlag.removeAttribute("fill-rule");
    shapeFlag.removeAttribute("clip-rule");
  }

  const sliderClipRadius = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--radius-sm");

  lenis.stop();
  initHeroEases();

  const heroFadeElements = gsap.utils.toArray<HTMLElement>(".banner-reveal");
  const slider = document.querySelector<HTMLElement>(".slider");
  const sliderItems = gsap.utils.toArray<HTMLElement>(".slider-img");
  const sliderImages = gsap.utils.toArray<HTMLImageElement>(".slider-img img");
  const headerWrap = document.querySelector<HTMLElement>(".header-wrapp");
  const headerWrapTargets = headerWrap ? [headerWrap] : [];
  const sliderTargets = slider ? [slider] : [];
  const headerStartYPx = -32;

  gsap.set(heroFadeElements, {
    yPercent: 110,
  });

  gsap.set(headerWrapTargets, {
    y: headerStartYPx,
  });

  gsap.set(sliderTargets, {
    yPercent: 35,
    clipPath: `inset(12% 0% 12% 0% round ${sliderClipRadius})`,
  });

  gsap.set(sliderItems, { autoAlpha: 0 });
  gsap.set(sliderItems[0], { autoAlpha: 1 });

  gsap.set(".slider-title__item", {
    y: 0,
  });

  gsap.set(sliderImages, {
    scale: 1.45,
    transformOrigin: "50% 50%",
  });

  if (loadingText) {
    gsap.set(loadingText, {
      autoAlpha: 1,
    });
  }

  if (loaderContent) {
    gsap.set(loaderContent, {
      y: 14,
      autoAlpha: 0,
    });
  }

  gsap.set(loaderChrome, { y: 10, autoAlpha: 0 });
  gsap.set(progressBar, { scaleX: 0, transformOrigin: "0% 50%" });

  if (mark) {
    gsap.set(mark, {
      scale: 1,
      autoAlpha: 1,
      transformOrigin: "50% 50%",
    });
  }

  if (countValue) {
    countValue.textContent = "0";
  }

  if (loaderStatus) {
    loaderStatus.textContent = "Loading, 0 percent";
  }

  const hideLoader = () => {
    loader.style.pointerEvents = "none";
    loader.style.display = "none";
  };

  const finish = () => {
    if (loaderFinished) return;

    loaderFinished = true;

    if (loaderFailsafe !== undefined) {
      window.clearTimeout(loaderFailsafe);
      loaderFailsafe = undefined;
    }

    loader.setAttribute("aria-busy", "false");

    hideLoader();
    gsap.set(transitionBlocks, { autoAlpha: 0 });

    lenis.scrollTo(0, {
      immediate: true,
    });

    lenis.start();

    initHomepageScrollStory();
    initPageScroll();

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
      refreshScrollStory();
      updateScrollState();
    });
  };

  const revealHero = () => {
    if (session !== loaderSession) return;

    document.documentElement.classList.remove("is-loading");
  };

  const forceShowIntroTargets = () => {
    gsap.set(heroFadeElements, {
      yPercent: 0,
      clearProps: "transform",
    });

    gsap.set(headerWrapTargets, {
      y: 0,
      clearProps: "transform",
    });

    gsap.set(sliderTargets, {
      yPercent: 0,
      clipPath: `inset(0% 0% 0% 0% round ${sliderClipRadius})`,
      clearProps: "transform,clipPath",
    });

    gsap.set(sliderImages, {
      scale: 1.3,
      transformOrigin: "50% 50%",
    });
  };

  const progress = {
    val: 0,
  };

  const updateProgress = () => {
    if (!isActive()) return;

    const value = Math.min(100, Math.round(progress.val));

    if (countValue) {
      countValue.textContent = String(value);
    }

    if (loaderStatus) {
      loaderStatus.textContent = `Loading, ${value} percent`;
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(1, progress.val / 100)})`;
    }
  };

  const runHeroReveal = () => {
    if (session !== loaderSession) return;

    revealHero();

    const targets = {
      meta: gsap.utils.toArray<HTMLElement>(".banner-text .banner-reveal"),
      title: gsap.utils.toArray<HTMLElement>(".banner-title .banner-reveal"),
      descr: gsap.utils.toArray<HTMLElement>(".banner-descr .banner-reveal"),
    };

    if (
      !targets.meta.length &&
      !targets.title.length &&
      !targets.descr.length
    ) {
      forceShowIntroTargets();
      finish();
      return;
    }

    const revealTL = gsap.timeline({
      onComplete: () => {
        if (session !== loaderSession) return;

        forceShowIntroTargets();
        finish();
      },
    });

    loaderTimeline = revealTL;

    [...transitionRows].reverse().forEach((row, index) => {
      const [leftBlock, rightBlock] = Array.from(row.children);
      const position = index * 0.1;

      revealTL.to(
        leftBlock,
        {
          xPercent: -101,
          duration: 0.72,
          ease: "power3.inOut",
        },
        position,
      );
      revealTL.to(
        rightBlock,
        {
          xPercent: 101,
          duration: 0.72,
          ease: "power3.inOut",
        },
        position,
      );
    });

    revealTL
      .to(
        headerWrapTargets,
        {
          y: 0,
          duration: 0.85,
          ease: "headerEase",
        },
        0.12,
      )
      .to(
        targets.meta,
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.18,
      )
      .to(
        targets.title,
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.24,
      )
      .to(
        targets.descr,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.32,
      )
      .to(
        sliderTargets,
        {
          yPercent: 0,
          clipPath: `inset(0% 0% 0% 0% round ${sliderClipRadius})`,
          duration: 1.4,
          ease: "power3.out",
        },
        0.15,
      )
      .to(
        sliderImages,
        {
          scale: 1.3,
          duration: 1.4,
          ease: "power3.out",
        },
        "<",
      );
  };

  const addBlockCover = (
    timeline: gsap.core.Timeline,
    startTime: number,
  ) => {
    transitionRows.forEach((row, index) => {
      const blocks = Array.from(row.children);
      const position = startTime + index * 0.1;

      timeline.set(blocks, { autoAlpha: 1 }, position);
      timeline.to(
        blocks,
        {
          xPercent: 0,
          duration: 0.72,
          ease: "power3.inOut",
        },
        position,
      );
    });
  };

  const runFallbackExit = () => {
    if (session !== loaderSession) return;

    const exitTL = gsap.timeline();

    loaderTimeline = exitTL;

    exitTL.to(
      loader,
      {
        backgroundColor: "var(--color-dark)",
        duration: 0.75,
        ease: "power2.inOut",
      },
      0,
    );

    if (loaderContent) {
      exitTL.to(
        loaderContent,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        0.15,
      );
    }

    exitTL.to(
      loaderChrome,
      { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
      0.22,
    );

    exitTL.to(
      progress,
      {
        val: 100,
        duration: 3.6,
        ease: "power1.inOut",
        onUpdate: updateProgress,
      },
      0,
    );

    exitTL.to({}, { duration: 3.6 }, 0);

    if (loadingText) {
      exitTL.to(loadingText, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }

    if (mark) {
      exitTL.to(
        mark,
        {
          autoAlpha: 0,
          scale: 1.05,
          duration: 0.5,
          ease: "power2.in",
        },
        loadingText ? "<" : ">",
      );
    }

    addBlockCover(exitTL, 3.8);

    exitTL
      .set(loader, { autoAlpha: 0 }, 4.92)
      .call(hideLoader, [], 4.92)
      .call(runHeroReveal, [], 4.92);
  };

  const runLoaderTimeline = () => {
    if (session !== loaderSession) return;

    if (shapes.length < 2) {
      runFallbackExit();
      return;
    }

    try {
      gsap.killTweensOf(shapes);

      gsap.set(shapes, {
        transformOrigin: "50% 50%",
        scale: 0.85,
        autoAlpha: 1,
        fillOpacity: 0,
        strokeOpacity: 1,
        clearProps: "strokeDasharray,strokeDashoffset",
      });

      gsap.set(shapes, {
        drawSVG: "0%",
      });

      const loaderTL = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
      });

      loaderTimeline = loaderTL;

      loaderTL.to(
        loader,
        {
          backgroundColor: "var(--color-dark)",
          duration: 0.75,
          ease: "power2.inOut",
        },
        0,
      );

      if (loaderContent) {
        loaderTL.to(
          loaderContent,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          0.15,
        );
      }

      loaderTL.to(
        loaderChrome,
        { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
        0.22,
      );

      loaderTL
        .to(
          progress,
          {
            val: 100,
            duration: 3.7,
            ease: "power1.inOut",
            onUpdate: updateProgress,
          },
          0,
        )
        .to(
          shapes,
          {
            drawSVG: "100%",
            duration: 0.9,
            stagger: 0.15,
          },
          0,
        )
        .to(
          shapeHex!,
          {
            duration: 1.1,
            morphSVG: {
              shape: FINAL_HEX,
              shapeIndex: "auto",
            },
          },
          0.5,
        )
        .to(
          shapeFlag!,
          {
            duration: 1.1,
            morphSVG: {
              shape: FINAL_FLAG,
              shapeIndex: "auto",
            },
          },
          0.65,
        )
        .to(
          shapes,
          {
            fillOpacity: 1,
            strokeOpacity: 0,
            duration: 0.5,
          },
          1.5,
        )
        .to(
          shapes,
          {
            scale: 1.06,
            duration: 0.22,
            ease: "power1.out",
          },
          1.85,
        )
        .to(
          shapes,
          {
            scale: 1,
            duration: 0.4,
            ease: "back.out(3)",
          },
          2.07,
        );

      if (loadingText) {
        loaderTL.to(
          loadingText,
          { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
          3.7,
        );
      }

      if (mark) {
        loaderTL.to(
          mark,
          {
            scale: 1.08,
            autoAlpha: 0,
            duration: 0.55,
            ease: "power2.in",
          },
          3.8,
        );
      }

      addBlockCover(loaderTL, 4.05);

      loaderTL
        .set(loader, { autoAlpha: 0 }, 5.17)
        .call(hideLoader, [], 5.17)
        .call(runHeroReveal, [], 5.17);
    } catch (error) {
      console.warn(
        "[loader] Morph/Draw timeline failed, using fallback",
        error,
      );

      runFallbackExit();
    }
  };

  const startLoader = () => {
    loaderRaf = undefined;

    if (session !== loaderSession) return;

    try {
      runLoaderTimeline();
    } catch (error) {
      console.warn("[loader] start failed, using fallback", error);

      runFallbackExit();
    }
  };

  loaderFailsafe = window.setTimeout(() => {
    if (session !== loaderSession || loaderFinished) {
      return;
    }

    loaderTimeline?.kill();

    revealHero();
    forceShowIntroTargets();
    finish();
  }, 12000);

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

    loaderFinished = false;
  });
}
