import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations, initLoader } from "./animations";
import { initButtonSystem } from "./button";
import { addCleanup, runCleanups } from "./cleanup";
import { initMediaQueries, mm } from "./globals";
import { initLogoHover } from "./logo-hover";
import { initMobileMenu } from "./mobile-menu";
import { initProjectDetail } from "./project-detail";
import {
  initSmoothScroll,
  resetScrollLock,
  updateScrollState,
} from "./smooth-scroll";

let appInitialized = false;
let appInitRaf: number | undefined;

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
    footerStatus.textContent = `${time}, we are ${isOpen ? "open" : "closed"}`;
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
  if (appInitRaf !== undefined) {
    window.cancelAnimationFrame(appInitRaf);
    appInitRaf = undefined;
  }
  runCleanups();

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf("*");
  mm?.revert();
  document.documentElement.classList.remove("is-loading");
  resetScrollLock();
  document.body.classList.remove(
    "is-menu-open",
    "is-project-panel-open",
    "is-header-compact",
    "is-hero-pinned",
    "is-header-on-dark",
    "has-custom-cursor",
  );
  gsap.set(
    ".banner-reveal, .slider, .slider-img img, .hero__img, .header, .header-wrapp, .header-link, .header-logo svg",
    { clearProps: "all" },
  );
  const fadeElements = gsap.utils.toArray<HTMLElement>(".banner-reveal");
  if (fadeElements.length) gsap.set(fadeElements, { yPercent: 0 });
  gsap.set(".slider", { yPercent: 0 });
  gsap.set(".header-wrapp", { y: 0 });
  document.documentElement.classList.remove("is-loading");
  const loader = document.getElementById("loader");
  if (loader) {
    gsap.set(loader, { clearProps: "all" });
    loader.style.display = "";
    loader.style.pointerEvents = "";
  }
  const curtain = document.querySelector<HTMLElement>(".loader-curtain");
  if (curtain) {
    gsap.set(curtain, { clearProps: "all" });
    curtain.style.display = "";
  }
  appInitialized = false;
}

export function initApp() {
  if (appInitialized) return;

  // Wait one frame if Loader hasn't mounted yet (StrictMode / HMR)
  if (!document.getElementById("loader")) {
    if (appInitRaf !== undefined) return;
    let tries = 0;
    const retry = () => {
      appInitRaf = undefined;
      if (document.getElementById("loader")) {
        initApp();
        return;
      }
      tries += 1;
      if (tries < 10) appInitRaf = window.requestAnimationFrame(retry);
    };
    appInitRaf = window.requestAnimationFrame(retry);
    return;
  }

  appInitialized = true;

  gsap.registerPlugin(ScrollTrigger);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  resetScrollLock();
  document.documentElement.classList.add("is-loading");

  initMediaQueries();

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  });

  initSmoothScroll();
  initButtonSystem();
  initAnimations();
  initLoader();
  initLogoHover();
  initMobileMenu();
  initProjectDetail();
  initGlobalUI();
}
