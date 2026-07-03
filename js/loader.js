function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  lenis.stop();
  document.body.style.overflow = "hidden";

  const loaderTitle = new SplitType(".loader-title", {
    types: "chars",
  });

  const heroLineSplits = gsap.utils
    .toArray(".hero-headline .line")
    .map((line) => new SplitType(line, { types: "chars" }));
  const heroHeadlineChars = heroLineSplits.flatMap((split) => split.chars);

  gsap.set(".loader-card", {
    xPercent: -50,
    yPercent: -50,
    scale: 0,
    rotate: (i) => [8, -3, -10, 10, -7, 5][i],
  });

  gsap.set([loaderTitle.chars, heroHeadlineChars], {
    yPercent: 100,
    rotation: 10,
    transformOrigin: "0% 100%",
  });

  gsap.set(".loader-count p", { yPercent: 100 });
  gsap.set(".hero-meta-top span, .hero-lede, .hero-support, .hero-cta", {
    y: 24,
    opacity: 0,
  });

  const loaderCounter = document.getElementById("loaderPct");
  const loaderTL = gsap.timeline({ delay: 0.5 });

  loaderTL
    .to(".loader-card", {
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.2,
    })

    .set(".loader-brand", { visibility: "visible" }, 0.35)

    .to(
      loaderTitle.chars,
      {
        yPercent: 0,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.04,
      },
      0.35,
    )

    .to(
      ".loader-count p",
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
      },
      "<",
    )

    .to(
      { value: 0 },
      {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate() {
          loaderCounter.textContent = String(
            Math.round(this.targets()[0].value),
          ).padStart(3, "0");
        },
      },
      "<0.5",
    )

    .to(
      loaderTitle.chars,
      {
        yPercent: -100,
        rotation: -10,
        duration: 0.75,
        ease: "power3.in",
        stagger: 0.04,
      },
      3.25,
    )

    .to(
      ".loader-count p",
      {
        yPercent: -100,
        duration: 0.75,
        ease: "power3.in",
      },
      3.25,
    )

    .to(
      ".loader-card",
      {
        scale: 0,
        clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
        duration: 1,
        ease: "power3.inOut",
        stagger: -0.075,
      },
      3.5,
    )

    .to(
      ".loader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          lenis.scrollTo(0, { immediate: true });
          lenis.start();
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
          measureThemeSections();
          morphButtons.forEach((btn) => btn._renderOrganic?.());
          updateScrollState();
        },
      },
      4.35,
    )

    .to(
      heroHeadlineChars,
      {
        yPercent: 0,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.04,
      },
      4.65,
    )

    .to(
      ".hero-meta-top span, .hero-lede, .hero-support, .hero-cta",
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      },
      4.95,
    );
}
