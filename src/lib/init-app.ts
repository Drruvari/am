import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations, initHeaderTheme } from "./animations";
import { initButtonSystem } from "./button";
import { addCleanup, runCleanups } from "./cleanup";
import { initMediaQueries, mm } from "./globals";
import { initLogoHover } from "./logo-hover";
import { initProjectDetail } from "./project-detail";
import {
  initSmoothScroll,
  resetScrollLock,
  updateScrollState,
} from "./smooth-scroll";

let appInitialized = false;
let bootSession = 0;

function isHomeRoute(pathname = window.location.pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return !/\/(works?|studio|process|gallery)$/.test(normalized);
}

function bootHomepageMotion(session: number) {
  if (session !== bootSession || !appInitialized) return false;

  if (!document.querySelector(".home-page")) return false;

  initAnimations();
  initProjectDetail();
  return true;
}

function clearEntranceLocks() {
  document.documentElement.classList.remove("is-entering", "is-loading");
}

function initGlobalUI() {
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const footerStatus = document.getElementById("footerStatus");
  const updateFooterStatus = () => {
    if (!footerStatus) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/Tirane",
      timeZoneName: "short",
    });
    const hour = Number(
      now.toLocaleString("en-AU", {
        hour: "numeric",
        hour12: false,
        timeZone: "Europe/Tirane",
      }),
    );
    const isOpen = hour >= 8 && hour < 17;
    footerStatus.textContent = `${time} · studio ${isOpen ? "open" : "closed"}`;
  };

  updateFooterStatus();
  const footerStatusInterval = window.setInterval(updateFooterStatus, 60_000);
  addCleanup(() => window.clearInterval(footerStatusInterval));

  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      ScrollTrigger.refresh();
      updateScrollState();
    }
  };
  window.addEventListener("pageshow", onPageShow);
  addCleanup(() => window.removeEventListener("pageshow", onPageShow));

  const onLoad = () => {
    ScrollTrigger.refresh();
    updateScrollState();
  };
  window.addEventListener("load", onLoad);
  addCleanup(() => window.removeEventListener("load", onLoad));

  const onResize = () => {
    updateScrollState();
  };
  window.addEventListener("resize", onResize);
  addCleanup(() => window.removeEventListener("resize", onResize));

  let orientationTimeout: number | undefined;
  const onOrientationChange = () => {
    if (orientationTimeout !== undefined) {
      window.clearTimeout(orientationTimeout);
    }
    orientationTimeout = window.setTimeout(() => {
      orientationTimeout = undefined;
      ScrollTrigger.refresh();
      updateScrollState();
    }, 300);
  };
  window.addEventListener("orientationchange", onOrientationChange);
  addCleanup(() => {
    window.removeEventListener("orientationchange", onOrientationChange);
    if (orientationTimeout !== undefined) {
      window.clearTimeout(orientationTimeout);
    }
  });
}

export function disposeApp() {
  bootSession += 1;
  runCleanups();

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf("*");
  mm?.revert();
  resetScrollLock();
  document.body.classList.remove(
    "is-menu-open",
    "is-project-panel-open",
    "is-hero-pinned",
    "is-header-on-dark",
    "is-footer-visible",
    "has-custom-cursor",
  );
  const resetTargets = gsap.utils.toArray<HTMLElement>(
    ".banner-reveal, .slider, .slider-img img, .hero__img, .header, .header-wrapp, .header-link, .header-logo svg",
  );
  if (resetTargets.length) {
    gsap.set(resetTargets, { clearProps: "all" });
  }
  const fadeElements = gsap.utils.toArray<HTMLElement>(".banner-reveal");
  if (fadeElements.length) gsap.set(fadeElements, { yPercent: 0 });
  const sliders = gsap.utils.toArray<HTMLElement>(".slider");
  if (sliders.length) gsap.set(sliders, { yPercent: 0 });
  const headerWrappers = gsap.utils.toArray<HTMLElement>(".header-wrapp");
  if (headerWrappers.length) gsap.set(headerWrappers, { y: 0 });
  document.documentElement.classList.remove("is-loading", "is-entering");
  appInitialized = false;
}

export function initApp() {
  if (appInitialized) return;

  appInitialized = true;
  const session = ++bootSession;

  gsap.registerPlugin(ScrollTrigger);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  resetScrollLock();

  initMediaQueries();

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  });

  const isTouchViewport = window.matchMedia(
    "(max-width: 768px), (hover: none) and (pointer: coarse)",
  ).matches;

  // Stabilizes pin scrubbing against mobile browser chrome / address-bar resize.
  if (isTouchViewport) {
    ScrollTrigger.normalizeScroll(true);
    addCleanup(() => ScrollTrigger.normalizeScroll(false));
  }

  initSmoothScroll();
  initButtonSystem();
  initLogoHover();
  initGlobalUI();

  const cleanupHeaderTheme = initHeaderTheme();
  if (cleanupHeaderTheme) addCleanup(cleanupHeaderTheme);

  if (bootHomepageMotion(session)) return;

  if (!isHomeRoute()) {
    clearEntranceLocks();
    return;
  }

  // Home route but DOM not ready yet (Suspense/HMR) — retry briefly.
  let attempts = 0;
  const maxAttempts = 120;
  let frame = 0;

  const retry = () => {
    if (session !== bootSession || !appInitialized) return;

    if (bootHomepageMotion(session)) return;

    attempts += 1;
    if (attempts >= maxAttempts) {
      clearEntranceLocks();
      return;
    }

    frame = window.requestAnimationFrame(retry);
  };

  frame = window.requestAnimationFrame(retry);
  addCleanup(() => window.cancelAnimationFrame(frame));
}
