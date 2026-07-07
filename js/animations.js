function prepareTextHoverElement(el) {
  if (el.classList.contains("text-hover-target")) return el;

  const styles = getComputedStyle(el);
  const needsInnerWrapper =
    el.matches("a, button") ||
    el.classList.contains("archive-card__label") ||
    el.classList.contains("project-card__label") ||
    styles.display === "flex" ||
    parseFloat(styles.paddingTop) > 0 ||
    parseFloat(styles.paddingBottom) > 0;

  if (!needsInnerWrapper) return el;

  const wrapper = document.createElement("span");
  wrapper.className = "text-hover-inner";
  wrapper.textContent = el.textContent.trim();
  el.replaceChildren(wrapper);
  return wrapper;
}

function initTextHoverEffects() {
  const hoverTargets = [
    ".hero__cta .btn__label > span",
    ".archive-card__label",
    ".project-card__label",
    ".site-header__nav a",
    ".site-header__contact-link .btn__label > span",
    ".site-header__menu-btn .btn__label > span",
    ".footer__cta-link .btn__label > span:first-child",
    ".nav-drawer__close .btn__label > span",
    ".footer-nav-links a",
    ".footer-bar a",
    ".project-panel__close .btn__label > span",
  ];

  document.querySelectorAll(hoverTargets.join(",")).forEach((target) => {
    const el = prepareTextHoverElement(target);
    if (el.dataset.textHoverReady === "true") return;
    el.dataset.textHoverReady = "true";
    el.classList.add("text-hover-target");

    const label = el.textContent.trim();
    if (!label) return;
    el.dataset.textHoverLabel = label;

    const track = document.createElement("span");
    const current = document.createElement("span");
    const next = document.createElement("span");

    track.className = "text-hover-track";
    current.className = "text-hover-line";
    next.className = "text-hover-line";
    next.setAttribute("aria-hidden", "true");
    current.textContent = label;
    next.textContent = label;
    track.append(current, next);
    el.replaceChildren(track);

    let lineShift = 0;
    const measure = () => {
      lineShift = current.getBoundingClientRect().height;
      if (el.classList.contains("is-text-hover")) {
        gsap.set(track, { y: -lineShift });
      }
    };

    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);

    const trigger = el.closest(".btn") || el.closest("a, button") || el;
    const setHover = (active) => {
      measure();
      el.classList.toggle("is-text-hover", active);
      gsap.to(track, {
        y: active ? -lineShift : 0,
        duration: active ? 0.46 : 0.38,
        ease: active ? "power4.out" : "power3.inOut",
        overwrite: "auto",
      });
    };

    trigger.addEventListener("mouseenter", () => setHover(true));
    trigger.addEventListener("mouseleave", () => setHover(false));
    trigger.addEventListener("focus", () => setHover(true));
    trigger.addEventListener("blur", () => setHover(false));
  });
}

function initButtons() {
  const buttons = gsap.utils.toArray(".btn");

  buttons.forEach((btn) => {
    if (btn.dataset.btnReady === "true") return;
    btn.dataset.btnReady = "true";

    const layer = document.createElement("span");
    const body = document.createElement("span");
    const content = btn.querySelector(".btn__label");
    const interactive = btn.querySelector("a, button");

    layer.className = "btn__bg";
    body.className = "btn__surface";
    layer.setAttribute("aria-hidden", "true");
    layer.append(body);
    btn.prepend(layer);

    const setHover = (active) => {
      btn.classList.toggle("is-hover", active);
      gsap.to(body, {
        scale: active ? 1.03 : 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (content && !content.querySelector(".text-hover-target")) {
        gsap.to(content, {
          y: active ? -1 : 0,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    btn.addEventListener("mouseenter", () => setHover(true));
    btn.addEventListener("mouseleave", () => setHover(false));
    interactive?.addEventListener("focus", () => setHover(true));
    interactive?.addEventListener("blur", () => setHover(false));
  });

  mm.add("(min-width: 769px) and (pointer: fine)", () => {
    const MAGNET_STRENGTH = 0.24;
    const TEXT_FOLLOW_STRENGTH = 0.38;

    const cleanups = buttons.map((btn) => {
      const content = btn.querySelector(".btn__label");
      const textTrack = content?.querySelector(".text-hover-track");
      const textTarget = textTrack || content;
      const isHeaderBtn = btn.closest(".site-header");
      const magnetStrength = isHeaderBtn ? 0.18 : MAGNET_STRENGTH;
      const textStrength = isHeaderBtn ? 0.28 : TEXT_FOLLOW_STRENGTH;

      const btnXTo = gsap.quickTo(btn, "x", {
        duration: 0.42,
        ease: "power3.out",
      });
      const btnYTo = gsap.quickTo(btn, "y", {
        duration: 0.42,
        ease: "power3.out",
      });
      const labelXTo = textTarget
        ? gsap.quickTo(textTarget, "x", { duration: 0.34, ease: "power3.out" })
        : null;
      const labelYTo = textTarget
        ? gsap.quickTo(textTarget, "y", { duration: 0.34, ease: "power3.out" })
        : null;

      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btnXTo(x * magnetStrength);
        btnYTo(y * magnetStrength);

        if (labelXTo) {
          const textOffset = textTrack
            ? textStrength - magnetStrength
            : textStrength;

          labelXTo(x * textOffset);

          if (!textTrack && labelYTo) {
            labelYTo(y * textOffset);
          }
        }
      };

      const onLeave = () => {
        btnXTo(0);
        btnYTo(0);
        labelXTo?.(0);
        if (!textTrack) {
          labelYTo?.(0);
        }
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      return () => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        gsap.set([btn, content, textTarget].filter(Boolean), {
          clearProps: "transform",
        });
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

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
    )
    .fromTo(
      heroImage,
      { scale: 1.1 },
      { scale: 1, ease: "none", duration: 1 },
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
  initButtons();
  initTextHoverEffects();
  initProjectCardHover();
}
