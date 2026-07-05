function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  lenis.stop();
  document.body.style.overflow = "hidden";

  const heroLineSplits = gsap.utils
    .toArray(".hero-headline .line")
    .map((line) => new SplitType(line, { types: "chars" }));
  const heroHeadlineChars = heroLineSplits.flatMap((split) => split.chars);

  gsap.set(heroHeadlineChars, {
    yPercent: 100,
    rotation: 10,
    transformOrigin: "0% 100%",
  });
  gsap.set(
    ".hero-kicker span, .hero-support, .hero-cta, .hero-facade-shell",
    {
      y: 24,
      opacity: 0,
    },
  );

  const speed = 0.5;
  const loaderTL = gsap.timeline({ delay: 0.12 });

  loaderTL
    .to(
      ".loader-number-2 .loader-number-wrap",
      {
        duration: speed * 2.4,
        yPercent: -90,
        ease: "power2.inOut",
      },
      0,
    )
    .to(
      ".loader-number-3 .loader-number-wrap",
      {
        duration: speed * 2.4,
        yPercent: -90,
        ease: "power2.inOut",
      },
      0,
    )
    .to(
      ".loader-pre .loader-line:nth-child(1) p",
      {
        duration: speed * 0.75,
        y: 0,
        ease: "power3.out",
      },
      0.12,
    )
    .to(
      ".loader-pre .loader-line:nth-child(2) p",
      {
        duration: speed * 0.75,
        y: 0,
        ease: "power3.out",
      },
      0.22,
    )
    .to(
      ".loader-progress",
      {
        duration: speed * 2.4,
        width: "100%",
        ease: "power2.inOut",
      },
      0,
    )
    .to(
      ".loader-number-1 .loader-number-wrap",
      {
        duration: speed * 0.7,
        y: 0,
        ease: "power3.out",
      },
      0.45,
    )
    .to(
      [".loader-number-wrap", ".loader-numbers"],
      {
        duration: speed * 0.85,
        yPercent: -100,
        ease: "power3.inOut",
      },
      ">",
    )
    .to(
      ".loader-percent",
      {
        duration: speed * 0.85,
        yPercent: -100,
        ease: "power3.inOut",
      },
      "<",
    )
    .to(
      ".loader-pre .loader-line p",
      {
        duration: speed * 0.55,
        yPercent: -110,
        stagger: 0.07,
        ease: "power3.in",
      },
      "<0.05",
    )
    .to(
      ".loader-progress",
      {
        duration: speed * 0.9,
        height: "100%",
        ease: "power3.inOut",
      },
      "<",
    )
    .to(
      ".loader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.48,
        ease: "power3.inOut",
        onComplete: () => {
          loader.style.pointerEvents = "none";
          lenis.scrollTo(0, { immediate: true });
          lenis.start();
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
          updateScrollState();
        },
      },
      ">",
    )
    .to(
      heroHeadlineChars,
      {
        yPercent: 0,
        rotation: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.018,
      },
      "<0.12",
    )
    .to(
      ".hero-kicker span, .hero-support, .hero-cta, .hero-facade-shell",
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.62,
        ease: "power3.out",
      },
      "<0.16",
    );
}
