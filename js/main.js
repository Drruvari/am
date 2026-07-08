var mm;
var desktopQuery;
var mobileQuery;
var finePointerQuery;
var prefersReducedMotionQuery;

function initGlobalUI() {
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  const footerStatus = document.getElementById("footerStatus");
  const updateFooterStatus = () => {
    if (!footerStatus) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/Tirane",
    });
    const hour = Number(
      now.toLocaleString("en-AU", {
        hour: "numeric",
        hour12: false,
        timeZone: "Europe/Tirane",
      }),
    );
    const isOpen = hour >= 8 && hour < 17;
    footerStatus.textContent = `${time} CET, we are ${isOpen ? "open" : "closed"}`;
  };

  updateFooterStatus();
  window.setInterval(updateFooterStatus, 60_000);

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      ScrollTrigger.refresh();
      updateScrollState();
    }
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    updateScrollState();
  });

  window.addEventListener("resize", () => {
    updateScrollState();
  });

  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => {
      ScrollTrigger.refresh();
      updateScrollState();
    }, 300);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  desktopQuery = window.matchMedia("(min-width: 769px)");
  mobileQuery = window.matchMedia("(max-width: 768px)");
  finePointerQuery = window.matchMedia(
    "(min-width: 769px) and (hover: hover) and (pointer: fine)",
  );
  prefersReducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  mm = gsap.matchMedia();

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  });

  initSmoothScroll();
  initCursor();
  initButtonSystem();
  initAnimations();
  initLoader();
  initLogoHover();
  initMobileMenu();
  initProjectDetail();
  initGlobalUI();
});
