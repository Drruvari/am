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
  gsap.set(".hero-meta-top span, .hero-lede, .hero-support, .hero-cta", {
    y: 24,
    opacity: 0,
  });

  const speed = 0.9;
  const phases = [
    { second: 3, third: 5 },
    { second: 7, third: 8 },
  ];
  const loaderTL = gsap.timeline({ delay: 0.25 });

  phases.forEach(({ second, third }, index) => {
    const progress = second * 10 + third;

    loaderTL.to(
      ".loader-number-2 .loader-number-wrap",
      {
        duration: speed,
        yPercent: (second - 1) * -10,
        ease: "power2.inOut",
      },
      ">",
    );
    loaderTL.to(
      ".loader-number-3 .loader-number-wrap",
      {
        duration: speed,
        yPercent: (third - 1) * -10,
        ease: "power2.inOut",
      },
      "<",
    );
    loaderTL.to(
      `.loader-pre .loader-line:nth-child(${index + 1}) p`,
      {
        duration: speed / 2,
        y: 0,
        ease: "power3.out",
      },
      "<",
    );
    loaderTL.to(
      ".loader-progress",
      {
        duration: speed,
        width: `${progress}%`,
        ease: "power2.inOut",
      },
      "<",
    );
  });

  loaderTL
    .to(
      [
        ".loader-number-2 .loader-number-wrap",
        ".loader-number-3 .loader-number-wrap",
      ],
      {
        duration: speed,
        yPercent: -90,
        ease: "power2.inOut",
      },
      ">",
    )
    .to(
      ".loader-progress",
      {
        duration: speed,
        width: "100%",
        ease: "power2.inOut",
      },
      "<",
    )
    .to(
      ".loader-number-1 .loader-number-wrap",
      {
        duration: speed,
        y: 0,
        ease: "power3.out",
      },
      "<",
    )
    .to(
      ".loader-number-wrap, .loader-numbers",
      {
        duration: speed,
        yPercent: -100,
        ease: "power3.inOut",
      },
      ">",
    )
    .to(
      ".loader-percent",
      {
        duration: speed,
        yPercent: -100,
        ease: "power3.inOut",
      },
      "<",
    )
    .to(
      ".loader-pre .loader-line p",
      {
        duration: speed / 2,
        yPercent: -110,
        stagger: 0.12,
        ease: "power3.in",
      },
      "<",
    )
    .to(".loader-progress", {
      duration: speed / 1.5,
      height: "100%",
      ease: "power3.inOut",
    })
    .to(
      ".loader-welcome .loader-line p",
      {
        duration: speed / 2,
        y: 0,
        stagger: 0.12,
        ease: "power3.out",
      },
      ">",
    )
    .to(
      ".loader-welcome .loader-line p",
      {
        duration: 0.45,
        yPercent: -110,
        stagger: 0.08,
        ease: "power3.in",
      },
      ">0.65",
    )
    .to(
      ".loader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
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
        duration: 1,
        ease: "power3.out",
        stagger: 0.04,
      },
      "<0.25",
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
      "<0.3",
    );
}
