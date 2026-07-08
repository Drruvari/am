function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const logoSvg = loader.querySelector(".loader__logo-svg svg");
  const countValue = loader.querySelector(".loader__progress-value");
  const loaderStatus = document.getElementById("loaderStatus");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const eyeRevealDuration = prefersReducedMotion
    ? 0.8
    : isMobile
      ? 1.8
      : 3.4;
  const eyeElements = logoSvg
    ? getLogoEyeElements(logoSvg, "loader-")
    : null;

  if (eyeElements) {
    resetLogoEye(eyeElements);
  }

  lenis.stop();

  const heroLineSplits = gsap.utils
    .toArray(".hero__title .line")
    .map((line) => new SplitType(line, { types: "chars" }));
  const heroHeadlineChars = heroLineSplits.flatMap((split) => split.chars);

  gsap.set(heroHeadlineChars, {
    yPercent: 100,
    rotation: 10,
    transformOrigin: "0% 100%",
  });
  gsap.set(".hero__meta span, .hero__lede, .hero__cta, .hero__media", {
    y: 24,
    opacity: 0,
  });

  const finish = () => {
    loader.setAttribute("aria-busy", "false");
    loader.style.pointerEvents = "none";
    lenis.scrollTo(0, { immediate: true });
    lenis.start();
    ScrollTrigger.refresh(true);
    initPageScroll();
    updateScrollState();
  };

  const revealHero = () => {
    document.documentElement.classList.remove("is-loading");
    gsap.set(".hero__img", { scale: 1, transformOrigin: "50% 100%" });
  };

  const updateDrawProgress = (progressRatio) => {
    const progress = Math.min(100, Math.round(progressRatio * 100));

    if (countValue) {
      countValue.textContent = String(progress);
    }

    if (loaderStatus) {
      loaderStatus.textContent = `Loading, ${progress} percent`;
    }
  };

  const runLoaderTimeline = () => {
    const loaderTL = gsap.timeline();

    loaderTL
      .to(
        ".loader__tagline span",
        {
          yPercent: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        0,
      )
      .to(
        ".loader__progress",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.08,
      );

    if (eyeElements) {
      addLogoEyeReveal(loaderTL, eyeElements, {
        duration: eyeRevealDuration,
        position: 0,
        onProgress: updateDrawProgress,
      });
    } else if (countValue) {
      countValue.textContent = "100";
    }

    loaderTL
      .to({}, { duration: 0.3 })
      .to(
        ".loader__meta",
        {
          y: -18,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        },
        ">-0.1",
      )
      .to(
        ".loader__progress",
        {
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        },
        "<",
      )
      .to(
        ".loader__logo",
        {
          opacity: 0,
          scale: 0.98,
          duration: 0.6,
          ease: "power3.inOut",
        },
        "<",
      )
      .to(
        ".loader",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.9,
          ease: "power4.inOut",
        },
        "<0.15",
      )
      .call(revealHero, null, ">")
      .to(heroHeadlineChars, {
        yPercent: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.02,
      })
      .to(
        ".hero__meta span, .hero__lede, .hero__cta, .hero__media",
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.8,
          ease: "power3.out",
        },
        "<0.1",
      )
      .call(finish, null, ">");
  };

  const startLoader = () => runLoaderTimeline();

  if (document.fonts?.ready) {
    document.fonts.ready.then(startLoader).catch(startLoader);
  } else {
    startLoader();
  }
}
