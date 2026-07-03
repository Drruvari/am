document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Flip);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  const desktopQuery = window.matchMedia("(min-width: 769px)");
  const finePointerQuery = window.matchMedia(
    "(min-width: 769px) and (pointer: fine)",
  );
  const mm = gsap.matchMedia();

  const round = (value) => Math.round(value * 10) / 10;

  const pointsToSmoothPath = (points) => {
    const count = points.length;
    let d = `M${round(points[0].x)} ${round(points[0].y)}`;

    for (let index = 0; index < count; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % count];
      const after = points[(index + 2) % count];
      const before = points[(index - 1 + count) % count];

      const cp1x = current.x + (next.x - before.x) / 6;
      const cp1y = current.y + (next.y - before.y) / 6;
      const cp2x = next.x - (after.x - current.x) / 6;
      const cp2y = next.y - (after.y - current.y) / 6;

      d += ` C${round(cp1x)} ${round(cp1y)} ${round(cp2x)} ${round(cp2y)} ${round(next.x)} ${round(next.y)}`;
    }

    return `${d}Z`;
  };

  const buildOrganicShape = (
    cx,
    cy,
    radius,
    phase,
    drift,
    wobble,
    leanX = 0,
    leanY = 0,
    pointCount = 10,
  ) =>
    buildOrganicEllipse(
      cx,
      cy,
      radius,
      radius,
      phase,
      drift,
      wobble,
      leanX,
      leanY,
      pointCount,
    );

  const buildOrganicEllipse = (
    cx,
    cy,
    rx,
    ry,
    phase,
    drift,
    wobble,
    leanX = 0,
    leanY = 0,
    pointCount = 10,
  ) => {
    const points = Array.from({ length: pointCount }, (_, index) => {
      const angle = (index / pointCount) * Math.PI * 2 - Math.PI / 2;
      const ripple =
        1 +
        Math.sin(angle * 2 + phase) * 0.08 * wobble +
        Math.sin(angle * 3 + drift * 1.37) * 0.052 * wobble +
        Math.cos(angle * 5 + phase * 0.62 + drift * 0.91) * 0.034 * wobble;

      return {
        x:
          cx +
          Math.cos(angle) * rx * ripple +
          leanX * (Math.cos(angle) * 0.32 + 0.05),
        y:
          cy +
          Math.sin(angle) * ry * ripple +
          leanY * (Math.sin(angle) * 0.32 + 0.05),
      };
    });

    return pointsToSmoothPath(points);
  };

  const buildOrganicCapsule = (
    width,
    height,
    inset,
    phase,
    drift,
    wobble,
    leanX = 0,
    leanY = 0,
    pointCount = 28,
  ) => {
    const cx = width / 2;
    const cy = height / 2;
    const rx = Math.max(8, width / 2 - inset);
    const ry = Math.max(8, height / 2 - inset);

    const points = Array.from({ length: pointCount }, (_, index) => {
      const angle = (index / pointCount) * Math.PI * 2 - Math.PI / 2;
      const ripple =
        1 +
        Math.sin(angle * 2 + phase) * 0.022 * wobble +
        Math.sin(angle * 3 + drift * 1.37) * 0.014 * wobble +
        Math.cos(angle * 5 + phase * 0.62 + drift * 0.91) * 0.009 * wobble;

      return {
        x:
          cx +
          Math.cos(angle) * rx * ripple +
          leanX * (Math.cos(angle) * 0.05 + 0.015),
        y:
          cy +
          Math.sin(angle) * ry * ripple +
          leanY * (Math.sin(angle) * 0.05 + 0.015),
      };
    });

    return pointsToSmoothPath(points);
  };

  const topbar = document.getElementById("topbar");

  let lenis;

  const updateScrollState = () => {
    const currentScroll =
      typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;

    if (topbar) {
      document.body.classList.toggle(
        "is-topbar-compact",
        currentScroll > window.innerHeight * 0.18,
      );

      const topbarProbeY = 36;
      const isOverDarkSection = [".sheets"].some((selector) => {
        const section = document.querySelector(selector);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        return rect.top <= topbarProbeY && rect.bottom >= topbarProbeY;
      });

      document.body.classList.toggle("is-topbar-inverted", isOverDarkSection);
    }

    updateDynamicTheme(currentScroll);
  };

  const root = document.documentElement;

  const hexToRgb = (hex) => {
    const value = hex.replace("#", "");
    const chunk = value.length === 3 ? 1 : 2;
    const read = (start) => {
      const part = value.slice(start, start + chunk);
      return parseInt(chunk === 1 ? part + part : part, 16);
    };

    return { r: read(0), g: read(chunk), b: read(chunk * 2) };
  };

  const rgbToHex = ({ r, g, b }) =>
    `#${[r, g, b]
      .map((channel) =>
        Math.round(gsap.utils.clamp(0, 255, channel))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;

  const mixRgb = (a, b, t) => ({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });

  const themeSections = gsap.utils
    .toArray("[data-theme-bg]")
    .map((section) => ({
      section,
      bg: hexToRgb(section.dataset.themeBg),
      fg: hexToRgb(section.dataset.themeFg),
      panel: hexToRgb(section.dataset.themePanel),
    }));

  let themeMetrics = [];

  const measureThemeSections = () => {
    themeMetrics = themeSections.map(({ section, bg, fg, panel }) => ({
      bg,
      fg,
      panel,
      start: section.offsetTop,
      end: section.offsetTop + section.offsetHeight,
    }));
  };

  const applyThemeColors = (bg, fg, panel) => {
    root.style.setProperty("--bg", rgbToHex(bg));
    root.style.setProperty("--fg", rgbToHex(fg));
    root.style.setProperty("--panel", rgbToHex(panel));
  };

  const updateDynamicTheme = (scrollY = window.scrollY) => {
    if (!themeMetrics.length) return;

    const probe = scrollY + window.innerHeight * 0.42;
    let index = 0;

    for (let i = themeMetrics.length - 1; i >= 0; i -= 1) {
      if (probe >= themeMetrics[i].start) {
        index = i;
        break;
      }
    }

    const current = themeMetrics[index];
    const next = themeMetrics[index + 1];
    const blendEnd = next ? next.start : current.end;
    const span = Math.max(blendEnd - current.start, 1);
    const t = next
      ? gsap.utils.clamp(0, 1, (probe - current.start) / span)
      : 0;

    applyThemeColors(
      mixRgb(current.bg, next?.bg ?? current.bg, t),
      mixRgb(current.fg, next?.fg ?? current.fg, t),
      mixRgb(current.panel, next?.panel ?? current.panel, t),
    );
  };

  measureThemeSections();
  updateDynamicTheme(0);

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

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOpen = document.getElementById("mobileMenuOpen");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

  const setMobileMenuOpen = (open) => {
    if (!mobileMenu) return;

    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    mobileMenuOpen?.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("is-mobile-menu-open", open);

    if (open) {
      lenis.stop();
    } else {
      lenis.start();
    }
  };

  mobileMenuOpen?.addEventListener("click", () => setMobileMenuOpen(true));
  mobileMenuClose?.addEventListener("click", () => setMobileMenuOpen(false));
  mobileMenuBackdrop?.addEventListener("click", () => setMobileMenuOpen(false));

  mobileMenu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      setMobileMenuOpen(false);
    }
  });

  const manifestoSplit = new SplitType("#manifestoText", { types: "words" });

  const cursor = document.getElementById("cursorMorph");

  const isDesktop = () => desktopQuery.matches;

  mm.add("(min-width: 769px)", () => {
    document.body.classList.add("has-custom-cursor");

    const circleA = document.getElementById("cursorMorphCircleA");
    const circleB = document.getElementById("cursorMorphCircleB");
    const fill = document.getElementById("cursorMorphFill");
    const core = document.getElementById("cursorMorphCore");
    const dot = document.getElementById("cursorMorphDot");

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.92,
      rotate: -6,
    });

    gsap.set(core, {
      transformOrigin: "50% 50%",
    });

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.34,
      ease: "expo.out",
    });

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.34,
      ease: "expo.out",
    });

    let lastMouseX = 0;
    let lastMouseY = 0;
    let activeType = null;

    const cursorStateClasses = ["is-link", "is-view", "is-project", "is-close"];

    const fgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--fg")
      .trim();

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();

    const hoverColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--hover")
      .trim();

    const clamp = gsap.utils.clamp;
    let hasPointer = false;
    let motionResetTimer;

    const ringConfigs = [
      {
        el: circleA,
        motion: { phase: 0, drift: 0 },
        radius: 50,
        wobbleMul: 1,
        phaseOffset: 0,
        driftOffset: 0.35,
      },
      {
        el: circleB,
        motion: { phase: 0, drift: 0 },
        radius: 46,
        wobbleMul: 1.1,
        phaseOffset: 1.6,
        driftOffset: 2.05,
      },
    ];

    const ringMotion = { leanX: 0, leanY: 0, boost: 0 };
    const dotMorph = { phase: 0, drift: 0 };

    const renderCursor = () => {
      const wobble = 1 + ringMotion.boost;

      ringConfigs.forEach((config) => {
        gsap.set(config.el, {
          attr: {
            d: buildOrganicShape(
              60,
              60,
              config.radius,
              config.motion.phase + config.phaseOffset,
              config.motion.drift + config.driftOffset,
              wobble * config.wobbleMul,
              ringMotion.leanX,
              ringMotion.leanY,
            ),
          },
        });
      });

      gsap.set(dot, {
        attr: {
          d: buildOrganicShape(
            60,
            60,
            6.1,
            dotMorph.phase,
            dotMorph.drift,
            0.62,
            ringMotion.leanX * 0.08,
            ringMotion.leanY * 0.08,
            7,
          ),
        },
      });
    };

    const leanXTo = gsap.quickTo(ringMotion, "leanX", {
      duration: 0.26,
      ease: "power1.out",
    });

    const leanYTo = gsap.quickTo(ringMotion, "leanY", {
      duration: 0.26,
      ease: "power1.out",
    });

    const boostTo = gsap.quickTo(ringMotion, "boost", {
      duration: 0.32,
      ease: "power1.out",
    });

    renderCursor();

    const cursorTweens = [
      gsap.to(ringConfigs[0].motion, {
        phase: Math.PI * 2,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),

      gsap.to(ringConfigs[0].motion, {
        drift: Math.PI * 2,
        duration: 9.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),

      gsap.to(ringConfigs[1].motion, {
        phase: -Math.PI * 2,
        duration: 7.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),

      gsap.to(ringConfigs[1].motion, {
        drift: -Math.PI * 2,
        duration: 10.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),

      gsap.to(circleA, {
        x: 2.2,
        y: -1.6,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),

      gsap.to(circleB, {
        x: -2,
        y: 1.8,
        duration: 6.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),

      gsap.to(dotMorph, {
        phase: Math.PI * 2,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),

      gsap.to(dotMorph, {
        drift: -Math.PI * 2,
        duration: 5.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: renderCursor,
      }),
    ];

    const cursorStates = {
      default: {
        size: 76,
        color: fgColor,
        fillOpacity: 0,
        scale: 0.92,
        rotate: -6,
        coreScale: 1,
        coreOpacity: 0.92,
        circleOpacity: 1,
        ghostOpacity: 0.42,
      },
      link: {
        size: 52,
        color: fgColor,
        fillOpacity: 0.045,
        scale: 1,
        rotate: 0,
        coreScale: 0.82,
        coreOpacity: 0.78,
        circleOpacity: 0.85,
        ghostOpacity: 0.18,
      },
      view: {
        size: 126,
        color: accentColor,
        fillOpacity: 0.07,
        scale: 1,
        rotate: 10,
        coreScale: 1.2,
        coreOpacity: 1,
        circleOpacity: 1,
        ghostOpacity: 0.45,
      },
      project: {
        size: 132,
        color: hoverColor,
        fillOpacity: 0.08,
        scale: 1,
        rotate: -12,
        coreScale: 1.24,
        coreOpacity: 1,
        circleOpacity: 1,
        ghostOpacity: 0.48,
      },
      close: {
        size: 88,
        color: accentColor,
        fillOpacity: 0.06,
        scale: 1,
        rotate: 45,
        coreScale: 0.95,
        coreOpacity: 0.72,
        circleOpacity: 1,
        ghostOpacity: 0.3,
      },
    };

    const applyCursorState = (type = "default") => {
      if (activeType === type) return;
      activeType = type;

      const state = cursorStates[type] || cursorStates.default;

      cursor.classList.remove(...cursorStateClasses);
      cursor.classList.add(`is-${type}`);

      gsap.to(cursor, {
        width: state.size,
        height: state.size,
        scale: state.scale,
        rotate: state.rotate,
        color: state.color,
        duration: 0.58,
        ease: "expo.out",
        overwrite: "auto",
      });

      gsap.to(fill, {
        opacity: state.fillOpacity,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(circleA, {
        opacity: state.circleOpacity,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(circleB, {
        opacity: state.ghostOpacity,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(core, {
        scale: state.coreScale,
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
      });

      gsap.to(dot, {
        opacity: state.coreOpacity,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const setCursorVisible = (visible = true) => {
      gsap.to(cursor, {
        opacity: visible ? 1 : 0,
        duration: visible ? 0.28 : 0.18,
        ease: "power3.out",
        overwrite: "auto",
        onStart: () => {
          if (visible) cursor.classList.add("is-visible");
        },
        onComplete: () => {
          if (!visible) cursor.classList.remove("is-visible");
        },
      });
    };

    const syncCursorState = () => {
      const pointerTarget = document.elementFromPoint(lastMouseX, lastMouseY);

      if (!pointerTarget || !document.documentElement.contains(pointerTarget)) {
        setCursorVisible(false);
        return;
      }

      const hiddenTarget = pointerTarget.closest("[data-cursor-hidden]");
      if (hiddenTarget) {
        setCursorVisible(false);
        return;
      }

      setCursorVisible(true);

      const hoverTarget = pointerTarget.closest("[data-hover]");
      if (!hoverTarget) {
        applyCursorState("default");
        return;
      }

      const type = hoverTarget.getAttribute("data-hover") || "link";
      applyCursorState(type);
    };

    const onMouseMove = (e) => {
      const dx = hasPointer ? e.clientX - lastMouseX : 0;
      const dy = hasPointer ? e.clientY - lastMouseY : 0;
      const speed = Math.hypot(dx, dy);

      hasPointer = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      xTo(lastMouseX);
      yTo(lastMouseY);

      leanXTo(clamp(-6, 6, dx * 0.18));
      leanYTo(clamp(-5, 5, dy * 0.15));
      boostTo(clamp(0, 0.9, speed / 22));

      clearTimeout(motionResetTimer);
      motionResetTimer = window.setTimeout(() => {
        boostTo(0);
        leanXTo(0);
        leanYTo(0);
      }, 140);

      syncCursorState();
    };

    const onStateInvalidated = () => {
      if (!cursor.classList.contains("is-visible")) return;
      requestAnimationFrame(syncCursorState);
    };

    const onMouseLeave = () => {
      hasPointer = false;
      lastMouseX = 0;
      lastMouseY = 0;
      clearTimeout(motionResetTimer);
      boostTo(0);
      leanXTo(0);
      leanYTo(0);
      setCursorVisible(false);
    };

    const onWindowBlur = () => {
      setCursorVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onStateInvalidated, { passive: true });
    window.addEventListener("resize", onStateInvalidated);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("click", onStateInvalidated);
    document.addEventListener("visibilitychange", onWindowBlur);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");

      clearTimeout(motionResetTimer);
      cursorTweens.forEach((tween) => tween.kill());

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onStateInvalidated);
      window.removeEventListener("resize", onStateInvalidated);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("click", onStateInvalidated);
      document.removeEventListener("visibilitychange", onWindowBlur);
      document.removeEventListener("mouseleave", onMouseLeave);

      cursor.classList.remove("is-visible", ...cursorStateClasses);
      gsap.set(cursor, { clearProps: "all" });
    };
  });

  if (!finePointerQuery.matches) {
    cursor?.classList.remove("is-visible");
  }

  const scramblePools = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    digit: "0123456789",
    symbol: "/—·+",
    mixed: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—",
  };

  const scramblePoolFor = (char) => {
    if (/[A-Z]/.test(char)) return scramblePools.upper;
    if (/[a-z]/.test(char)) return scramblePools.lower;
    if (/[0-9]/.test(char)) return scramblePools.digit;
    if (/[^\s]/.test(char)) return scramblePools.symbol;
    return scramblePools.mixed;
  };

  const scrambleRandom = (pool, avoid) => {
    if (pool.length < 2) return pool[0] || avoid;
    let next = pool[Math.floor(Math.random() * pool.length)];
    while (next === avoid) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    return next;
  };

  const scrambleTargets = [
    ".hero-cta .morph-btn__content > span",
    ".sheets-index",
    ".sheet-meta",
    ".works-cap",
    ".topbar a",
    ".topbar-brief .morph-btn__content > span",
    ".topbar-menu .morph-btn__content > span",
    ".footer-cta .morph-btn__content > span:first-child",
    ".mobile-menu-close .morph-btn__content > span",
    ".footer-nav-links a",
    ".footer-bar a",
    ".detail-close .morph-btn__content > span",
  ];

  const scrambleText = (el) => {
    const original = el.dataset.scrambleText || el.textContent;
    const originalHtml = el.dataset.scrambleHtml || el.innerHTML;
    el.dataset.scrambleText = original;
    el.dataset.scrambleHtml = originalHtml;

    const chars = [...original];
    const proxy = { progress: 0 };

    if (el._scrambleTween) el._scrambleTween.kill();

    el._scrambleTween = gsap.to(proxy, {
      progress: 1,
      duration: 0.78,
      ease: "power2.out",
      onUpdate: () => {
        const total = chars.length;
        el.textContent = chars
          .map((char, index) => {
            if (/\s/.test(char)) return char;

            const start = (index / total) * 0.55;
            const local = gsap.utils.clamp(
              0,
              1,
              (proxy.progress - start) / 0.45,
            );

            if (local >= 1) return char;
            if (local <= 0) return scrambleRandom(scramblePoolFor(char), char);

            const settle = local * local;
            return Math.random() < settle
              ? char
              : scrambleRandom(scramblePoolFor(char), char);
          })
          .join("");
      },
      onComplete: () => {
        el.innerHTML = originalHtml;
      },
    });
  };

  document.querySelectorAll(scrambleTargets.join(",")).forEach((el) => {
    el.dataset.scrambleText = el.textContent;
    el.dataset.scrambleHtml = el.innerHTML;
    el.addEventListener("mouseenter", () => scrambleText(el));
  });

  lenis.stop();
  document.body.style.overflow = "hidden";

  gsap.set(".loader-card", {
    xPercent: -50,
    yPercent: -50,
    scale: 0,
    rotate: (i) => [8, -3, -10, 10, -7, 5][i],
  });
  gsap.set(".loader-count", { xPercent: -50, yPercent: -50 });
  gsap.set(".loader-count p", { yPercent: 100 });
  gsap.set(".hero-headline .word-wrap", { yPercent: 110 });
  gsap.set(".hero-mark", { y: 40, opacity: 0 });
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
    .to(
      ".loader-count p",
      { yPercent: 0, duration: 1, ease: "power3.out" },
      0.35,
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
      0.85,
    )
    .to(
      ".loader-count p",
      { yPercent: -100, duration: 0.75, ease: "power3.in" },
      2.25,
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
      2.25,
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
      3.25,
    )
    .to(
      ".hero-mark",
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
      },
      3.55,
    )
    .fromTo(
      ".hero-headline .word-wrap",
      {
        yPercent: 110,
      },
      {
        yPercent: 0,
        stagger: 0.1,
        duration: 1.15,
        ease: "power4.out",
      },
      3.65,
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
      3.85,
    );

  gsap.from(manifestoSplit.words, {
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top 85%",
      end: "bottom 60%",
      scrub: 1,
    },
    opacity: 0.1,
    y: 10,
    stagger: 0.05,
  });

  mm.add("(min-width: 769px)", () => {
    const sheetsStack = document.getElementById("sheetsStack");
    const getHorizontalDistance = (track, endGap = 80) => {
      return Math.max(
        0,
        track.offsetLeft + track.scrollWidth - window.innerWidth + endGap,
      );
    };

    gsap.to(sheetsStack, {
      x: () => -getHorizontalDistance(sheetsStack, 96),
      ease: "none",
      scrollTrigger: {
        trigger: ".sheets",
        pin: true,
        start: "top top",
        end: () => `+=${getHorizontalDistance(sheetsStack, 96)}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.to(".sheets-copy", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: ".sheets",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.utils.toArray(".sheet").forEach((sheet, index) => {
      const image = sheet.querySelector("img");
      gsap.fromTo(
        image,
        { yPercent: index % 2 === 0 ? -6 : -12 },
        {
          yPercent: index % 2 === 0 ? 8 : 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".sheets",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => {
      gsap.set([sheetsStack, ".sheets-copy", ".sheet img"], {
        clearProps: "transform",
      });
    };
  });

  // Works Grid Parallax/Reveal
  gsap.fromTo(
    ".works-head h2",
    { yPercent: 10 },
    {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".works",
        start: "top bottom",
        end: "top 15%",
        scrub: true,
      },
    },
  );

  gsap.utils
    .toArray(".works-head")
    .forEach((block) => {
      gsap.from(block, {
        y: 60,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: block,
          start: "top 82%",
        },
      });
    });

  gsap.utils.toArray(".works-figure").forEach((figure) => {
    const image = figure.querySelector(".works-visual img");

    gsap.fromTo(
      figure,
      {
        y: 110,
        opacity: 0,
        clipPath: "inset(12% 0% 0% 0%)",
      },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.35,
        ease: "power4.out",
        scrollTrigger: {
          trigger: figure,
          start: "top 86%",
        },
      },
    );

    if (image) {
      gsap.fromTo(
        image,
        {
          yPercent: -10,
          scale: 1.12,
        },
        {
          yPercent: 10,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }
  });

  mm.add("(min-width: 769px)", () => {
    const cleanups = gsap.utils.toArray(".works-figure").map((figure) => {
      const image = figure.querySelector(".works-visual img");
      const xTo = gsap.quickTo(figure, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(figure, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
      const imgXTo = gsap.quickTo(image, "xPercent", {
        duration: 0.6,
        ease: "power3.out",
      });

      const onMove = (e) => {
        const rect = figure.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * 14);
        yTo(relY * 14);
        imgXTo(relX * -4);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        imgXTo(0);
      };

      figure.addEventListener("mousemove", onMove);
      figure.addEventListener("mouseleave", onLeave);

      return () => {
        figure.removeEventListener("mousemove", onMove);
        figure.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  const morphButtons = gsap.utils.toArray(".morph-btn");
  const organicMorphCleanups = [];

  morphButtons.forEach((btn) => {
    if (btn.dataset.morphReady === "true") return;
    btn.dataset.morphReady = "true";

    const isOrganic =
      btn.classList.contains("morph-btn--pill") ||
      btn.classList.contains("morph-btn--rect");

    const rings = document.createElement("span");
    rings.className = "morph-btn__rings";

    const content = btn.querySelector(".morph-btn__content");
    const interactive = btn.querySelector("a, button");
    let isHovering = false;
    let ringA;
    let ringB;
    let pathA;
    let pathB;
    let motion;
    let phaseTween;
    let driftTween;
    let resizeObserver;

    if (isOrganic) {
      btn.classList.add("morph-btn--organic");

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "morph-btn__svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("preserveAspectRatio", "none");

      pathA = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathA.setAttribute("class", "morph-btn__path morph-btn__path--a");

      pathB = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathB.setAttribute("class", "morph-btn__path morph-btn__path--b");

      svg.append(pathA, pathB);
      rings.append(svg);

      motion = { phase: 0, drift: 0, wobble: 1, boost: 0, leanX: 0, leanY: 0 };

      const renderOrganic = () => {
        const rect = btn.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        const wobble = motion.wobble + motion.boost;

        svg.setAttribute("viewBox", `0 0 ${round(width)} ${round(height)}`);
        pathA.setAttribute(
          "d",
          buildOrganicCapsule(
            width,
            height,
            0,
            motion.phase,
            motion.drift,
            wobble,
            motion.leanX,
            motion.leanY,
          ),
        );
        pathB.setAttribute(
          "d",
          buildOrganicCapsule(
            width,
            height,
            2,
            motion.phase + 0.75,
            motion.drift + 0.55,
            wobble * 0.92,
            motion.leanX * 0.45,
            motion.leanY * 0.45,
          ),
        );
      };

      phaseTween = gsap.to(motion, {
        phase: Math.PI * 2,
        duration: 8.4,
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: renderOrganic,
      });

      driftTween = gsap.to(motion, {
        drift: -Math.PI * 2,
        duration: 11.2,
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: renderOrganic,
      });

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(renderOrganic);
        resizeObserver.observe(btn);
      }

      window.addEventListener("load", renderOrganic, { once: true });
      requestAnimationFrame(renderOrganic);

      btn._renderOrganic = renderOrganic;
      btn._morphMotion = motion;

      organicMorphCleanups.push(() => {
        phaseTween?.kill();
        driftTween?.kill();
        resizeObserver?.disconnect();
      });
    } else {
      ringA = document.createElement("span");
      ringA.className = "morph-btn__ring morph-btn__ring--a";
      ringA.setAttribute("aria-hidden", "true");

      ringB = document.createElement("span");
      ringB.className = "morph-btn__ring morph-btn__ring--b";
      ringB.setAttribute("aria-hidden", "true");

      rings.append(ringA, ringB);
    }

    btn.prepend(rings);

    const setHoverState = (active) => {
      if (isHovering === active) return;
      isHovering = active;

      const hoverTargets = [rings, ringA, ringB, content].filter(Boolean);
      gsap.killTweensOf(hoverTargets);

      if (active) {
        btn.classList.add("is-hover");

        if (isOrganic && motion) {
          phaseTween.timeScale(1.55);
          driftTween.timeScale(1.45);

          gsap.to(motion, {
            boost: 0.28,
            duration: 0.55,
            ease: "power3.out",
            onUpdate: btn._renderOrganic,
          });

          gsap.to(rings, {
            scale: 1.045,
            rotation: 2.5,
            duration: 0.62,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (content) {
            gsap.to(content, {
              y: -1,
              scale: 1,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });
          }

          return;
        }

        ringA.style.animationDuration = "2.2s";
        ringB.style.animationDuration = "2.6s";

        gsap.to(rings, {
          scale: 1.055,
          rotation: 4,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(ringA, {
          scale: 1.02,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (content) {
          gsap.to(content, {
            y: -3,
            scale: 1.02,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        return;
      }

      btn.classList.remove("is-hover");

      if (isOrganic && motion) {
        phaseTween.timeScale(1);
        driftTween.timeScale(1);

        gsap.to(motion, {
          boost: 0,
          leanX: 0,
          leanY: 0,
          duration: 0.72,
          ease: "power2.inOut",
          onUpdate: btn._renderOrganic,
        });

        gsap.to(rings, {
          scale: 1,
          rotation: 0,
          duration: 0.68,
          ease: "power2.inOut",
          overwrite: "auto",
        });

        if (content) {
          gsap.to(content, {
            y: 0,
            scale: 1,
            duration: 0.62,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }

        return;
      }

      ringA.style.animationDuration = "";
      ringB.style.animationDuration = "";

      gsap.to(rings, {
        scale: 1,
        rotation: 0,
        duration: 0.68,
        ease: "power2.inOut",
        overwrite: "auto",
      });

      gsap.to(ringA, {
        scale: 1,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: "auto",
      });

      if (content) {
        gsap.to(content, {
          y: 0,
          scale: 1,
          duration: 0.62,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    };

    const onEnter = () => setHoverState(true);
    const onLeave = () => setHoverState(false);

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("touchstart", onEnter, { passive: true });
    btn.addEventListener("touchend", onLeave);
    btn.addEventListener("touchcancel", onLeave);

    if (interactive) {
      interactive.addEventListener("focus", onEnter);
      interactive.addEventListener("blur", onLeave);
    }
  });

  mm.add("(min-width: 769px)", () => {
    const cleanups = [];

    morphButtons.forEach((btn) => {
      const content = btn.querySelector(".morph-btn__content");
      const pull = btn.classList.contains("morph-btn--circle")
        ? 0.3
        : btn.classList.contains("morph-btn--rect")
          ? 0.22
          : 0.18;
      const labelPull = pull * 0.34;

      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * pull,
          y: y * pull,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });

        if (btn._morphMotion) {
          gsap.to(btn._morphMotion, {
            leanX: x * 0.014,
            leanY: y * 0.012,
            duration: 0.38,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: btn._renderOrganic,
          });
        }

        if (content) {
          gsap.to(content, {
            x: x * labelPull,
            y: y * labelPull,
            duration: 0.42,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.78,
          ease: "elastic.out(1, 0.45)",
          overwrite: "auto",
        });

        if (btn._morphMotion) {
          gsap.to(btn._morphMotion, {
            leanX: 0,
            leanY: 0,
            duration: 0.72,
            ease: "power2.inOut",
            overwrite: "auto",
            onUpdate: btn._renderOrganic,
          });
        }

        if (content) {
          gsap.to(content, {
            x: 0,
            y: 0,
            duration: 0.78,
            ease: "elastic.out(1, 0.45)",
            overwrite: "auto",
          });
        }
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        gsap.set([btn, content].filter(Boolean), { clearProps: "transform" });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  // Project Detail View
  let detailOpen = false;
  const detailOverlay = document.getElementById("detail");
  const detailClose = document.getElementById("detailClose");
  const detailVisual = document.getElementById("detailVisual");
  const detailGallery = document.getElementById("detailGallery");

  const populateDetail = (figure) => {
    const image = figure.querySelector(".works-visual img");
    const title = figure.getAttribute("data-title") || "Project Study";
    const loc = figure.getAttribute("data-loc") || "Location";
    const year = figure.getAttribute("data-year") || "Study";
    const imageSrc = image ? image.currentSrc || image.src : "";
    const imageAlt = image ? image.alt : title;

    detailVisual.innerHTML = imageSrc
      ? `<img src="${imageSrc}" alt="${imageAlt}">`
      : "";
    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailIndex").textContent =
      figure.getAttribute("data-index") || "A—00";
    document.getElementById("detailLoc").textContent = `${loc} — ${year}`;
    document.getElementById("detailDesc").textContent =
      figure.getAttribute("data-desc") || "";
    document.getElementById("detailMeta").innerHTML = `
      <div><span>Typology</span>${figure.getAttribute("data-type") || "Study"}</div>
      <div><span>Status</span>${figure.getAttribute("data-status") || "Concept"}</div>
      <div><span>Scale</span>${figure.getAttribute("data-scale") || "TBD"}</div>
      <div><span>Materials</span>${figure.getAttribute("data-materials") || "Material study"}</div>
    `;
    detailGallery.innerHTML = (figure.getAttribute("data-images") || "")
      .split("|")
      .filter(Boolean)
      .slice(1)
      .map(
        (src) => `<img src="${src}" alt="${title} study image" loading="lazy">`,
      )
      .join("");
  };

  const openDetail = (figure) => {
    if (detailOpen) return;
    detailOpen = true;

    populateDetail(figure);
    detailOverlay.classList.add("active");
    document.body.classList.add("is-detail-open");
    lenis.stop();

    gsap.killTweensOf([
      ".detail-info > *",
      ".detail-visual img",
      detailOverlay,
    ]);
    gsap.set(detailOverlay, { autoAlpha: 1 });
    gsap.fromTo(
      ".detail-visual img",
      {
        clipPath: "inset(8% 8% 8% 8%)",
        scale: 1.08,
        opacity: 0.7,
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
      },
    );
    gsap.fromTo(
      ".detail-info > *",
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.07,
        duration: 0.68,
        ease: "power3.out",
        delay: 0.12,
      },
    );
  };

  const closeDetail = () => {
    if (!detailOpen) return;

    gsap.killTweensOf([
      ".detail-info > *",
      ".detail-visual img",
      detailOverlay,
    ]);
    gsap.to(".detail-info > *", {
      opacity: 0,
      y: -18,
      duration: 0.28,
      ease: "power2.in",
    });
    gsap.to(".detail-visual img", {
      scale: 1.04,
      opacity: 0,
      duration: 0.42,
      ease: "power3.inOut",
    });
    gsap.to(detailOverlay, {
      autoAlpha: 0,
      duration: 0.48,
      ease: "power3.inOut",
      onComplete: () => {
        detailOpen = false;
        detailOverlay.classList.remove("active");
        document.body.classList.remove("is-detail-open");
        detailVisual.innerHTML = "";
        detailGallery.innerHTML = "";
        lenis.start();
      },
    });
  };

  document.querySelectorAll(".works-figure").forEach((figure) => {
    figure.addEventListener("click", () => openDetail(figure));
  });

  detailClose.addEventListener("click", closeDetail);
  detailOverlay.addEventListener("click", (e) => {
    if (e.target === detailOverlay) closeDetail();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });

  window.addEventListener("load", () => {
    measureThemeSections();
    morphButtons.forEach((btn) => btn._renderOrganic?.());
    ScrollTrigger.refresh();
    updateScrollState();
  });

  window.addEventListener("resize", () => {
    measureThemeSections();
    updateScrollState();
  });
});
