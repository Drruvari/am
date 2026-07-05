var lenis;
var topbarCompactState;

function initSmoothScroll() {
  const topbar = document.getElementById("topbar");

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
    ScrollTrigger.normalizeScroll(true);
    lenis = {
      get scroll() {
        return window.scrollY;
      },
      on() {},
      stop() {
        document.body.style.overflow = "hidden";
      },
      start() {
        document.body.style.overflow = "";
      },
      scrollTo(target, options = {}) {
        const top =
          typeof target === "number"
            ? target
            : target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top,
          behavior: options.immediate ? "auto" : "smooth",
        });
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
    lenis.scrollTo(target, {
      duration: 1.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  });
}

function updateScrollState() {
  const topbar = document.getElementById("topbar");
  const currentScroll =
    typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;

  if (topbar) {
    const isCompact = currentScroll > window.innerHeight * 0.18;
    const shouldAnimateTopbar =
      topbarCompactState !== undefined && topbarCompactState !== isCompact;

    document.body.classList.toggle(
      "is-topbar-compact",
      isCompact,
    );

    if (topbarCompactState !== isCompact) {
      topbarCompactState = isCompact;
      if (shouldAnimateTopbar && typeof syncTopbarActionMotion === "function") {
        syncTopbarActionMotion(isCompact);
      }
    }

    document.body.classList.remove("is-topbar-inverted");
  }
}
