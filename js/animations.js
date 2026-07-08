let pageScrollInitialized = false;
let verticalMiddleContext;

function scheduleScrollRefresh() {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh(true);
    updateScrollState();
  });
}

function initHeroHandoff({ hero, heroContainer, heroImage, heroShell }) {
  if (!hero || !heroContainer || !heroImage || !heroShell) return null;

  const heroText = gsap.utils.toArray(".hero__meta, .hero__content");
  heroText.forEach((el) => {
    el.style.overflow = "hidden";
  });

  const getHeroBleed = () =>
    parseFloat(getComputedStyle(hero).paddingLeft) || 0;

  gsap.set(heroImage, { scale: 1, transformOrigin: "50% 100%" });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=90%",
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        document.body.classList.toggle("is-hero-pinned", self.isActive);
      },
    },
  });

  timeline
    .to(
      heroText,
      {
        yPercent: -14,
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: "power2.in",
        duration: 0.7,
      },
      0,
    )
    .to(heroContainer, { gap: 0, ease: "power2.in", duration: 0.7 }, 0)
    .fromTo(
      heroShell,
      { flexGrow: 0 },
      { flexGrow: 1, ease: "power2.inOut", duration: 1 },
      0,
    )
    .to(
      heroShell,
      {
        "--hero-media-bleed": () => `${getHeroBleed()}px`,
        ease: "power2.inOut",
        duration: 0.45,
      },
      0,
    );

  return timeline;
}

function initVerticalMiddleScroll() {
  if (verticalMiddleContext) {
    verticalMiddleContext.revert();
  }

  verticalMiddleContext = gsap.context(() => {
    gsap.set(".manifesto__image", { clearProps: "width" });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealGroups = [
      {
        trigger: ".manifesto",
        items: ".manifesto__eyebrow, .manifesto__line",
        y: 48,
        stagger: 0.08,
      },
      {
        trigger: ".archive",
        items: ".archive__intro > *, .archive-card",
        y: 56,
        stagger: 0.08,
      },
      {
        trigger: ".projects",
        items: ".projects__intro > *, .project-card",
        y: 64,
        stagger: 0.08,
      },
      {
        trigger: ".footer",
        items: ".footer-hero > *, .footer-grid > *, .footer-bar > *",
        y: 48,
        stagger: 0.06,
      },
    ];

    revealGroups.forEach(({ trigger, items, y, stagger }) => {
      const section = document.querySelector(trigger);
      const targets = gsap.utils.toArray(items);

      if (!section || !targets.length) return;

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        stagger,
        ease: "power4.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });
    });

    if (prefersReducedMotion) return;

    const parallaxItems = [
      ".manifesto__image img",
      ".archive-card img",
      ".project-card__media img",
      ".footer-image-block img",
    ];

    gsap.utils.toArray(parallaxItems.join(",")).forEach((img) => {
      const trigger =
        img.closest(".archive-card") ||
        img.closest(".project-card") ||
        img.closest(".manifesto__line") ||
        img.closest(".footer-image-block") ||
        img;

      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    gsap.utils.toArray(".archive-card, .project-card").forEach((item) => {
      gsap.fromTo(
        item,
        { y: 42 },
        {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });
}

function initScrollAnimations() {
  mm.add("(min-width: 769px)", () => {
    const hero = document.querySelector(".hero");
    const heroContainer = document.querySelector(".hero__body");
    const heroImage = document.querySelector(".hero__img");
    const heroShell = document.querySelector(".hero__media");

    const heroAnimation = initHeroHandoff({
      hero,
      heroContainer,
      heroImage,
      heroShell,
    });

    return () => {
      heroAnimation?.scrollTrigger?.kill();
      heroAnimation?.kill();
      document.body.classList.remove("is-hero-pinned");
      gsap.set(
        [heroContainer, heroShell, heroImage, ".hero__meta", ".hero__content"],
        {
          clearProps:
            "transform,opacity,height,margin,padding,gap,flexGrow,--hero-media-bleed",
        },
      );
      gsap.utils.toArray(".hero__meta, .hero__content").forEach((el) => {
        el.style.overflow = "";
      });
    };
  });

  mm.add("(max-width: 768px)", () => {
    document.body.classList.remove("is-hero-pinned");

    return () => {
      document.body.classList.remove("is-hero-pinned");
    };
  });
}

function initPageScroll() {
  if (pageScrollInitialized) return;
  pageScrollInitialized = true;

  initScrollAnimations();
  initVerticalMiddleScroll();

  scheduleScrollRefresh();

  if (document.readyState === "complete") {
    scheduleScrollRefresh();
  } else {
    window.addEventListener("load", scheduleScrollRefresh, { once: true });
  }
}

function initProjectCardHover() {
  mm.add("(min-width: 769px)", () => {
    const cleanups = gsap.utils.toArray(".project-card").map((card) => {
      const media = card.querySelector(".project-card__media");
      const image = card.querySelector(".project-card__media img");
      const caption = card.querySelector(".project-card__label");
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
      const imgXTo = gsap.quickTo(image, "xPercent", {
        duration: 0.6,
        ease: "power3.out",
      });

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * 14);
        yTo(relY * 14);
        rotateXTo(relY * -4);
        rotateYTo(relX * 5);
        imgXTo(relX * -4);

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
        gsap.to(caption, {
          x: 10,
          color: "var(--fg)",
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        rotateXTo(0);
        rotateYTo(0);
        imgXTo(0);
        gsap.to(media, {
          "--spot-opacity": 0,
          duration: 0.34,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(caption, {
          x: 0,
          color: "var(--muted)",
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
        });
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

function initAnimations() {
  initProjectCardHover();
}
