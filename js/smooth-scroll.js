var lenis;
var headerCompactState;
var savedScrollY = 0;

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function getHeaderOffset() {
  const header = document.getElementById("site-header");
  return header ? header.getBoundingClientRect().height + 12 : 72;
}

function lockPageScroll() {
  savedScrollY = window.scrollY;
  document.body.classList.add("is-scroll-locked");
  document.body.style.top = `-${savedScrollY}px`;
}

function unlockPageScroll() {
  document.body.classList.remove("is-scroll-locked");
  document.body.style.top = "";
  window.scrollTo(0, savedScrollY);
}

function scrollToTarget(target, options = {}) {
  const el =
    typeof target === "number"
      ? null
      : typeof target === "string"
        ? document.querySelector(target)
        : target;

  const offset = options.offset ?? getHeaderOffset();

  if (document.documentElement.classList.contains("lenis-smooth") && lenis?.scrollTo) {
    if (typeof target === "number") {
      lenis.scrollTo(target, {
        duration: options.immediate ? 0 : 1.2,
        immediate: options.immediate,
      });
      return;
    }

    lenis.scrollTo(el, {
      offset: -offset,
      duration: options.immediate ? 0 : 1.2,
      immediate: options.immediate,
    });
    return;
  }

  const top =
    typeof target === "number"
      ? target
      : el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: options.immediate ? "auto" : "smooth",
  });
}

function initSmoothScroll() {
  const isTouchOnly = navigator.maxTouchPoints > 0 && !finePointerQuery.matches;
  const useSmoothScroll = desktopQuery.matches && !isTouchOnly;

  if (useSmoothScroll) {
    document.documentElement.classList.add("lenis", "lenis-smooth");
    lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: false,
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      updateScrollState();
    });
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    document.documentElement.classList.remove("lenis", "lenis-smooth");
    lenis = {
      get scroll() {
        return window.scrollY;
      },
      on() {},
      stop() {
        lockPageScroll();
      },
      start() {
        unlockPageScroll();
      },
      scrollTo(target, options = {}) {
        scrollToTarget(target, options);
      },
    };

    window.addEventListener(
      "scroll",
      () => {
        ScrollTrigger.update();
        updateScrollState();
      },
      { passive: true },
    );
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    history.pushState(null, "", hash);
    scrollToTarget(target, { offset: getHeaderOffset() });
  });
}

function updateScrollState() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const currentScroll =
    typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;
  const isCompact = currentScroll > window.innerHeight * 0.12;

  document.body.classList.toggle("is-header-compact", isCompact);
  headerCompactState = isCompact;
}
