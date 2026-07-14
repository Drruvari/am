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
import { lenis, updateScrollState } from "./smooth-scroll";

let pageScrollInitialized = false;
let heroEasesInitialized = false;

function initHeroEases() {
  if (heroEasesInitialized) return;

  gsap.registerPlugin(CustomEase);
  CustomEase.create("preloaderEase", "0.48,0.00,0.83,0.83");
  CustomEase.create("headerEase", "0.17,0.17,0.52,1.00");
  CustomEase.create("titleEase", "0.17,0.17,0.49,1.00");
  CustomEase.create("titleEaseHide", "0.55,0.00,0.83,0.83");
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
  const headerLinks = gsap.utils.toArray<HTMLElement>(".header-link");
  const menuTrigger = document.querySelector<HTMLElement>(".header-menu-trigger");
  const menuIcon = document.querySelector<SVGSVGElement>(
    ".header-menu-trigger__icon, [data-header-menu-button-icon]",
  );
  const menuIconPaths = gsap.utils.toArray<SVGPathElement>(
    ".header-menu-trigger__icon path, [data-header-menu-button-icon] path",
  );
  // Kill any leftover GSAP filter / fill fighting CSS
  if (menuIcon) gsap.set(menuIcon, { clearProps: "filter,color,fill" });
  if (menuIconPaths.length) {
    gsap.set(menuIconPaths, { clearProps: "fill", attr: { fill: "currentColor" } });
  }

  let isHeaderOnDark = false;
  const setHeaderOnDark = (onDark: boolean) => {
    if (isHeaderOnDark === onDark) return;
    isHeaderOnDark = onDark;
    document.body.classList.toggle("is-header-on-dark", onDark);
    menuTrigger?.classList.toggle("is-on-dark", onDark);

    if (onDark) {
      if (header) gsap.set(header, { color: "#ffffff" });
      if (headerLinks.length) gsap.set(headerLinks, { color: "#ffffff" });
      if (menuTrigger) gsap.set(menuTrigger, { color: "#ffffff" });
      if (menuIcon) {
        gsap.set(menuIcon, {
          color: "#ffffff",
          clearProps: "filter",
        });
      }
      if (menuIconPaths.length) {
        menuIconPaths.forEach((path) => {
          path.setAttribute("fill", "#ffffff");
          path.style.fill = "#ffffff";
        });
      }
      return;
    }

    if (header) gsap.set(header, { clearProps: "color" });
    if (headerLinks.length) gsap.set(headerLinks, { clearProps: "color" });
    if (menuTrigger) gsap.set(menuTrigger, { clearProps: "color" });
    if (menuIcon) gsap.set(menuIcon, { clearProps: "color,filter" });
    if (menuIconPaths.length) {
      menuIconPaths.forEach((path) => {
        path.setAttribute("fill", "currentColor");
        path.style.removeProperty("fill");
      });
    }
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
    const transitionIsDark = timeline.progress() >= 0.25;
    const philosophyIsVisible =
      philosophy !== null &&
      philosophy.getBoundingClientRect().top <= window.innerHeight * 0.55;

    setHeaderOnDark(transitionIsDark && !philosophyIsVisible);
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
    start: "top 55%",
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

function initPhilosophyMotion() {
  const lines = gsap.utils.toArray<HTMLElement>(".philosophy__body p");
  if (!lines.length) return;

  gsap.set(lines, {
    transformOrigin: "0% 100%",
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".philosophy",
        start: "top 70%",
        end: "bottom 35%",
        scrub: 0.5,
      },
    })
    .fromTo(
      lines,
      {
        yPercent: 80,
        rotation: 2,
        autoAlpha: 0,
      },
      {
        yPercent: 0,
        rotation: 0,
        autoAlpha: 1,
        stagger: 0.12,
        ease: "power3.out",
      },
    );
}

function initSelectedWorksMotion() {
  gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
    const image = card.querySelector("img");
    const offset = index % 2 === 0 ? -32 : 32;

    gsap.fromTo(
      card,
      {
        y: 96,
        rotation: index % 2 === 0 ? -1.5 : 1.5,
        autoAlpha: 0,
      },
      {
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.to(card, {
      y: offset,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    if (image) {
      gsap.fromTo(
        image,
        {
          scale: 1.08,
          yPercent: -6,
        },
        {
          scale: 1.08,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  });
}

function initServicesMotion() {
  gsap.utils.toArray<HTMLElement>(".services__item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        yPercent: 35,
        autoAlpha: 0,
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        delay: index * 0.035,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

function initProcessMotion() {
  const steps = gsap.utils.toArray<HTMLElement>(".process__step");

  steps.forEach((step) => {
    gsap.fromTo(
      step,
      {
        autoAlpha: 0.35,
        xPercent: -4,
      },
      {
        autoAlpha: 1,
        xPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: step,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.45,
          toggleClass: {
            targets: step,
            className: "is-active",
          },
        },
      },
    );
  });

  gsap.fromTo(
    ".process__steps",
    {
      "--process-progress": "0%",
    },
    {
      "--process-progress": "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".process",
        start: "top center",
        end: "bottom center",
        scrub: true,
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
          ".philosophy__body p",
          ".project-card",
          ".services__item",
          ".process__step",
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

    initPhilosophyMotion();
    initSelectedWorksMotion();
    initServicesMotion();
    initProcessMotion();
    initFooterMotion();

    initMaskReveal(
      [
        ".project-card__media",
        ".architect-about__image",
        ".footer__image",
      ].join(","),
    );

    initRevealGroup({
      trigger: ".services",
      items: ".services__eyebrow, .services__intro > *",
    });

    initRevealGroup({
      trigger: ".process",
      items: ".process__eyebrow, .process__intro > *",
    });

    initRevealGroup({
      trigger: ".architect-about",
      items: ".architect-about__content > *",
      y: 56,
    });

    initRevealGroup({
      trigger: ".footer",
      items: ".footer__intro > *, .footer__grid > *, .footer__bar > *",
      y: 48,
    });
  });

  return () => ctx.revert();
}

function initScrollAnimations() {
  const cleanupHomepageMotion = initHomepageMotion();

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
          ".slider-numeric__item",
          ".header",
          ".header-wrapp",
          ".header-link",
        ],
        { clearProps: "all" },
      );
    };
  });

  addCleanup(() => {
    cleanupHomepageMotion();
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
      .toArray<HTMLElement>(".btn, [data-magnetic]")
      .map((button) => {
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
          const isMenuTrigger = button.classList.contains("header-menu-trigger");
          if (menuOpen && !isMenuTrigger) {
            xTo(0);
            yTo(0);
            return;
          }

          const rect = button.getBoundingClientRect();
          const relX = event.clientX - rect.left - rect.width / 2;
          const relY = event.clientY - rect.top - rect.height / 2;

          xTo(relX * 0.16);
          yTo(relY * 0.22);
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
  const curtain = document.querySelector<HTMLElement>(".loader-curtain");
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

  // Reset after StrictMode remount / prior finish()
  loader.style.display = "flex";
  loader.style.pointerEvents = "auto";
  loader.setAttribute("aria-busy", "true");
  gsap.set(loader, { autoAlpha: 1, clearProps: "opacity,visibility" });

  if (curtain) {
    curtain.style.display = "block";
    gsap.set(curtain, { scaleY: 1, transformOrigin: "50% 100%", autoAlpha: 1 });
  }

  const countValue =
    loader.querySelector(".loader__progress-value") ??
    document.getElementById("loaderCount");
  const loaderStatus = document.getElementById("loaderStatus");
  const pct = loader.querySelector<HTMLElement>(".loader__pct");
  const mark = loader.querySelector<SVGSVGElement>(".loader__mark");
  const shapeHex = loader.querySelector<SVGPathElement>("#shape-hex");
  const shapeFlag = loader.querySelector<SVGPathElement>("#shape-flag");
  const shapes = [shapeHex, shapeFlag].filter(Boolean) as SVGPathElement[];

  // HMR / remount can leave morphęd path data — always restore placeholders
  if (shapeHex) shapeHex.setAttribute("d", PLACEHOLDER_HEX);
  if (shapeFlag) {
    shapeFlag.setAttribute("d", PLACEHOLDER_FLAG);
    shapeFlag.removeAttribute("fill-rule");
    shapeFlag.removeAttribute("clip-rule");
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  lenis.stop();
  initHeroEases();

  const heroFadeElements = gsap.utils.toArray<HTMLElement>(".banner-reveal");
  const slider = document.querySelector<HTMLElement>(".slider");
  const sliderImages = gsap.utils.toArray<HTMLImageElement>(".slider-img img");
  const headerWrap = document.querySelector<HTMLElement>(".header-wrapp");
  const headerWrapTargets = headerWrap ? [headerWrap] : [];
  const sliderTargets = slider ? [slider] : [];

  // Pixel y — GSAP cannot reliably tween calc()/clamp() CSS vars
  const headerStartYPx = isMobile
    ? 0
    : -Math.min(100, Math.max(28, window.innerWidth * 0.069444444));

  gsap.set(heroFadeElements, { yPercent: 110 });
  gsap.set(headerWrapTargets, { y: headerStartYPx });
  gsap.set(sliderTargets, { yPercent: isMobile ? 0 : 50 });
  gsap.set(".slider-title__item", { y: 0 });
  gsap.set(".slider-numeric__item", { y: 0 });
  gsap.set(sliderImages, {
    scale: isMobile ? 1.12 : 1.7,
    transformOrigin: "50% 50%",
  });
  if (pct) gsap.set(pct, { autoAlpha: 1 });
  if (mark) gsap.set(mark, { scale: 1, autoAlpha: 1, transformOrigin: "50% 50%" });
  if (countValue) countValue.textContent = "0";
  if (loaderStatus) loaderStatus.textContent = "Loading, 0 percent";

  const hideLoader = () => {
    loader.style.pointerEvents = "none";
    loader.style.display = "none";
    if (curtain) curtain.style.display = "none";
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
    lenis.scrollTo(0, { immediate: true });
    lenis.start();
    ScrollTrigger.refresh(true);
    initPageScroll();
    updateScrollState();
  };

  const revealHero = () => {
    if (session !== loaderSession) return;
    document.documentElement.classList.remove("is-loading");
  };

  const forceShowIntroTargets = () => {
    gsap.set(heroFadeElements, { yPercent: 0, clearProps: "transform" });
    gsap.set(headerWrapTargets, { y: 0, clearProps: "transform" });
    gsap.set(sliderTargets, { yPercent: 0, clearProps: "transform" });
    gsap.set(sliderImages, {
      scale: 1.3,
      transformOrigin: "50% 50%",
    });
  };

  const progress = { val: 0 };

  const updateProgress = () => {
    if (!isActive()) return;
    const value = Math.min(100, Math.round(progress.val));
    if (countValue) countValue.textContent = String(value);
    if (loaderStatus) {
      loaderStatus.textContent = `Loading, ${value} percent`;
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

    // If split failed, show raw text and move on
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

    revealTL
      .to(
        headerWrapTargets,
        {
          y: 0,
          duration: 0.85,
          ease: "headerEase",
        },
        0,
      )
      .to(
        targets.meta,
        {
          yPercent: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "headerEase",
        },
        "<",
      )
      .to(
        targets.title,
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.2,
          ease: "headerEase",
        },
        "<",
      )
      .to(
        targets.descr,
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: "headerEase",
        },
        "<",
      )
      .to(
        sliderTargets,
        {
          yPercent: 0,
          duration: 1.05,
          ease: "headerEase",
        },
        "<",
      )
      .to(
        sliderImages,
        {
          scale: 1.3,
          duration: 1,
          ease: "none",
        },
        "<",
      );
  };

  const runFallbackExit = () => {
    if (session !== loaderSession) return;
    progress.val = 100;
    updateProgress();
    const exitTL = gsap.timeline({ onComplete: runHeroReveal });
    loaderTimeline = exitTL;
    exitTL
      .to(pct, { autoAlpha: 0, duration: 0.25 }, 0)
      .to(mark, { autoAlpha: 0, scale: 1.05, duration: 0.4, ease: "power2.in" }, 0)
      .to(curtain, { scaleY: 0, duration: 0.7, ease: "power4.inOut" }, 0.15)
      .set(loader, { autoAlpha: 0 })
      .call(hideLoader);
  };

  const runLoaderTimeline = () => {
    if (session !== loaderSession) return;

    if (shapes.length < 2) {
      runFallbackExit();
      return;
    }

    try {
      // Kill prior draw/morph state so DrawSVG can start from 0 again
      gsap.killTweensOf(shapes);
      gsap.set(shapes, {
        transformOrigin: "50% 50%",
        scale: 0.85,
        autoAlpha: 1,
        fillOpacity: 0,
        strokeOpacity: 1,
        clearProps: "strokeDasharray,strokeDashoffset",
      });
      gsap.set(shapes, { drawSVG: "0%" });

      const loaderTL = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: runHeroReveal,
      });
      loaderTimeline = loaderTL;

      loaderTL
        .to(
          progress,
          {
            val: 100,
            duration: 2.6,
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
            morphSVG: { shape: FINAL_HEX, shapeIndex: "auto" },
          },
          0.5,
        )
        .to(
          shapeFlag!,
          {
            duration: 1.1,
            morphSVG: { shape: FINAL_FLAG, shapeIndex: "auto" },
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
        )
        .to(pct, { autoAlpha: 0, duration: 0.3 }, 2.6)
        .to(
          mark,
          {
            scale: 1.08,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          2.7,
        )
        .to(
          curtain,
          {
            scaleY: 0,
            duration: 0.9,
            ease: "power4.inOut",
          },
          2.9,
        )
        .set(loader, { autoAlpha: 0 })
        .call(hideLoader);
    } catch (error) {
      console.warn("[loader] Morph/Draw timeline failed, using fallback", error);
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
    if (session !== loaderSession || loaderFinished) return;
    loaderTimeline?.kill();
    revealHero();
    forceShowIntroTargets();
    finish();
  }, 8000);

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
