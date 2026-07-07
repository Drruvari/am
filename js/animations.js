function prepareTextHoverElement(el) {
  if (el.classList.contains("text-hover-target")) return el;

  const styles = getComputedStyle(el);
  const needsInnerWrapper =
    el.matches("a, button") ||
    el.classList.contains("archive-card-label") ||
    el.classList.contains("works-cap") ||
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
    ".hero-cta .morph-btn__content > span",
    ".archive-card-label",
    ".works-cap",
    ".topbar-nav a",
    ".topbar-brief .morph-btn__content > span",
    ".topbar-menu .morph-btn__content > span",
    ".footer-cta .morph-btn__content > span:first-child",
    ".mobile-menu-close .morph-btn__content > span",
    ".footer-nav-links a",
    ".footer-bar a",
    ".detail-close .morph-btn__content > span",
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

    const trigger = el.closest(".morph-btn") || el.closest("a, button") || el;
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

    trigger.addEventListener("pointerenter", () => setHover(true));
    trigger.addEventListener("pointerleave", () => setHover(false));
    trigger.addEventListener("focus", () => setHover(true));
    trigger.addEventListener("blur", () => setHover(false));
  });
}

function ensureLiquidFilter() {
  if (document.getElementById("liquid-magnetic-goo")) return;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "morph-btn-filter");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <defs>
      <filter id="liquid-magnetic-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  `;

  document.body.prepend(svg);
}

function initMorphButtons() {
  const morphButtons = gsap.utils.toArray(".morph-btn");

  morphButtons.forEach((btn) => {
    if (btn.dataset.morphReady === "true") return;
    btn.dataset.morphReady = "true";

    const layer = document.createElement("span");
    const body = document.createElement("span");
    const content = btn.querySelector(".morph-btn__content");
    const interactive = btn.querySelector("a, button");

    layer.className = "morph-btn__rings";
    body.className = "morph-btn__body";
    layer.setAttribute("aria-hidden", "true");

    layer.append(body);
    btn.prepend(layer);

    const setHover = (active) => {
      if (
        document.body.classList.contains("is-hero-pinned") &&
        btn.closest(".topbar")
      ) {
        return;
      }

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

    btn.addEventListener("pointerenter", () => setHover(true));
    btn.addEventListener("pointerleave", () => setHover(false));

    if (interactive) {
      interactive.addEventListener("focus", () => setHover(true));
      interactive.addEventListener("blur", () => setHover(false));
    }
  });

  mm.add("(min-width: 769px) and (pointer: fine)", () => {
    const cleanups = [];

    morphButtons.forEach((btn) => {
      const content = btn.querySelector(".morph-btn__content");

      const onMove = (e) => {
        if (document.body.classList.contains("is-hero-pinned")) return;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.08,
          y: y * 0.08,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (content) {
          gsap.to(content, {
            x: x * 0.025,
            y: y * 0.025,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        gsap.to([btn, content].filter(Boolean), {
          x: 0,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

function initHeroFacade() {
  const bays = gsap.utils.toArray(".hero-bay");
  if (!bays.length) return;

  const defaultIndex = Math.max(
    0,
    bays.findIndex((bay) => bay.classList.contains("is-active")),
  );

  const setActive = (activeIndex) => {
    bays.forEach((bay, index) => {
      bay.classList.toggle("is-active", index === activeIndex);
    });
  };

  bays.forEach((bay, index) => {
    bay.addEventListener("focus", () => setActive(index));
    bay.addEventListener("blur", () => setActive(defaultIndex));
  });

  mm.add("(min-width: 769px) and (pointer: fine)", () => {
    const cleanups = bays.map((bay, index) => {
      const onEnter = () => setActive(index);
      bay.addEventListener("mouseenter", onEnter);

      return () => bay.removeEventListener("mouseenter", onEnter);
    });

    const facade = document.querySelector(".hero-facade");
    const onLeave = () => setActive(defaultIndex);
    facade?.addEventListener("mouseleave", onLeave);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      facade?.removeEventListener("mouseleave", onLeave);
      setActive(defaultIndex);
    };
  });
}

let manifestoRevealInitialized = false;
let manifestoWidthCache = new WeakMap();

function clearManifestoWidthCache() {
  manifestoWidthCache = new WeakMap();
}

function initManifestoReveal() {
  if (manifestoRevealInitialized) return;
  manifestoRevealInitialized = true;

  const getImgSpanWidth = (imgSpan) => {
    if (manifestoWidthCache.has(imgSpan)) {
      return manifestoWidthCache.get(imgSpan);
    }

    const img = imgSpan.querySelector("img");
    if (!img) return 0;

    const styles = getComputedStyle(imgSpan);
    const target = styles.getPropertyValue("--manifesto-img-width").trim();
    let width = 0;

    if (target) {
      const probe = document.createElement("div");
      probe.style.cssText = `position:absolute;visibility:hidden;width:${target};`;
      document.body.appendChild(probe);
      width = probe.getBoundingClientRect().width;
      probe.remove();
    } else {
      width = img.getBoundingClientRect().width;
    }

    manifestoWidthCache.set(imgSpan, width);
    return width;
  };

  const imgSpans = gsap.utils
    .toArray(".manifesto-line")
    .map((line) => line.querySelector(".manifesto-img-span"))
    .filter(Boolean);

  if (!imgSpans.length) return;

  const onResize = () => clearManifestoWidthCache();
  window.addEventListener("resize", onResize);

  gsap.set(imgSpans, { width: 0 });

  const bindSectionReveal = (start, end, spread = 0.82) => {
    return ScrollTrigger.create({
      trigger: ".manifesto",
      start,
      end,
      scrub: true,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const slot = spread / imgSpans.length;

        imgSpans.forEach((span, index) => {
          const width = getImgSpanWidth(span);
          const localStart = index * slot;
          const localProgress = gsap.utils.clamp(
            0,
            1,
            (self.progress - localStart) / slot,
          );
          span.style.width = `${width * localProgress}px`;
        });
      },
    });
  };

  const bindLineReveals = (start, end, scrub = 0.6) => {
    return imgSpans
      .map((span) => {
        const line = span.closest(".manifesto-line");
        if (!line) return null;

        return ScrollTrigger.create({
          trigger: line,
          start,
          end,
          scrub,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const width = getImgSpanWidth(span);
            span.style.width = `${width * self.progress}px`;
          },
        });
      })
      .filter(Boolean);
  };

  mm.add("(min-width: 769px)", () => {
    gsap.set(imgSpans, { width: 0 });
    const trigger = bindSectionReveal("top 88%", "bottom 18%");
    return () => {
      trigger.kill();
      window.removeEventListener("resize", onResize);
      gsap.set(imgSpans, { clearProps: "width" });
    };
  });

  mm.add("(max-width: 768px)", () => {
    gsap.set(imgSpans, { width: 0 });
    const triggers = bindLineReveals("top 88%", "top 68%", 0.5);
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", onResize);
      gsap.set(imgSpans, { clearProps: "width" });
    };
  });
}

function initWorksAnimations(isMobile) {
  gsap.fromTo(
    ".works-head h2",
    { yPercent: isMobile ? 4 : 10 },
    {
      yPercent: isMobile ? -3 : -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".works",
        start: "top bottom",
        end: isMobile ? "top 25%" : "top 15%",
        scrub: true,
        refreshPriority: 3,
      },
    },
  );

  gsap.utils.toArray(".works-head").forEach((block) => {
    gsap.from(block, {
      y: isMobile ? 28 : 60,
      opacity: 0,
      duration: isMobile ? 0.85 : 1.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: block,
        start: isMobile ? "top 90%" : "top 82%",
      },
    });
  });

  gsap.utils.toArray(".works-figure").forEach((figure) => {
    const image = figure.querySelector(".works-visual img");

    gsap.from(figure, {
      y: isMobile ? 36 : 110,
      opacity: 0,
      clipPath: isMobile ? "inset(6% 0% 0% 0%)" : "inset(12% 0% 0% 0%)",
      duration: isMobile ? 0.85 : 1.35,
      ease: "power4.out",
      scrollTrigger: {
        trigger: figure,
        start: isMobile ? "top 92%" : "top 86%",
      },
    });

    if (!isMobile && image) {
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
}

function getArchiveScrollDistance(track, endGap = 96) {
  if (!track) return 0;

  const paddingEnd = parseFloat(getComputedStyle(track).paddingRight) || 0;
  return Math.max(
    0,
    track.scrollWidth - track.clientWidth + paddingEnd + endGap,
  );
}

function ensureHeroCopyWrap(container) {
  if (!container) return null;

  const existing = container.querySelector(".hero-copy");
  if (existing) return existing;

  const kicker = container.querySelector(".hero-kicker");
  const main = container.querySelector(".hero-main");
  if (!kicker || !main) return null;

  const wrap = document.createElement("div");
  wrap.className = "hero-copy";
  kicker.before(wrap);
  wrap.append(kicker, main);
  return wrap;
}

function ensureHeroTransformWrap(shell) {
  if (!shell) return null;

  const parent = shell.parentElement;
  if (parent?.classList.contains("hero-facade-transform")) {
    return parent;
  }

  const wrap = document.createElement("div");
  wrap.className = "hero-facade-transform";
  shell.before(wrap);
  wrap.append(shell);
  return wrap;
}

function initHeroHandoff({ hero, heroContainer, heroImage, heroShell }) {
  const heroCopy = ensureHeroCopyWrap(heroContainer);
  const heroTransform = ensureHeroTransformWrap(heroShell);
  const heroMedia = heroShell?.querySelector(".hero-facade-media");
  if (
    !hero ||
    !heroContainer ||
    !heroImage ||
    !heroShell ||
    !heroCopy ||
    !heroTransform ||
    !heroMedia
  ) {
    return null;
  }

  const getHeroBleed = () => parseFloat(getComputedStyle(hero).paddingLeft) || 0;

  const heroMetrics = {
    coverScale: 1,
    targetX: 0,
    targetY: 0,
  };

  const measureHeroHandoff = (resetTransform = false) => {
    if (resetTransform) {
      gsap.set(heroTransform, { clearProps: "transform" });
    }

    const bleed = getHeroBleed();
    const viewportW = window.innerWidth;
    const viewportH = getStableViewportHeight();
    const shellRect = heroShell.getBoundingClientRect();
    const shellW = shellRect.width || 1;
    const shellH = shellRect.height || 1;

    heroMetrics.coverScale = Math.max(
      (viewportW + bleed * 2) / shellW,
      viewportH / shellH,
    );

    const shellCenterX = shellRect.left + shellW / 2;
    const shellCenterY = shellRect.top + shellH / 2;

    heroMetrics.targetX = viewportW / 2 - shellCenterX;
    heroMetrics.targetY = viewportH / 2 - shellCenterY;
  };

  const setHeroMotionState = (active) => {
    heroTransform.style.willChange = active ? "transform" : "auto";
    heroMedia.style.willChange = active ? "transform" : "auto";
  };

  measureHeroHandoff(true);
  setHeroMotionState(true);

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "hero-handoff",
      trigger: ".hero",
      start: "top top",
      end: () => `+=${getStableViewportHeight() * 0.9}`,
      pin: true,
      pinType: "fixed",
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      refreshPriority: 0,
      invalidateOnRefresh: true,
      onRefreshInit: (self) => {
        if (self.progress <= 0.001) measureHeroHandoff(true);
      },
      onToggle: (self) => {
        document.body.classList.toggle("is-hero-pinned", self.isActive);
        if (self.isActive) {
          document.body.classList.remove("is-topbar-compact");
          if (typeof topbarCompactState !== "undefined") {
            topbarCompactState = false;
          }
        } else if (typeof updateScrollState === "function") {
          updateScrollState();
        }
      },
      onLeave: () => setHeroMotionState(false),
      onEnterBack: () => setHeroMotionState(true),
    },
  });

  timeline
    .to(
      heroCopy,
      {
        y: -32,
        opacity: 0,
        ease: "power2.in",
        duration: 0.7,
        force3D: true,
      },
      0,
    )
    .fromTo(
      heroTransform,
      {
        x: 0,
        y: 0,
        scale: 1,
        immediateRender: false,
      },
      {
        x: () => heroMetrics.targetX,
        y: () => heroMetrics.targetY,
        scale: () => heroMetrics.coverScale,
        ease: "power2.inOut",
        duration: 1,
        force3D: true,
        immediateRender: false,
      },
      0,
    )
    .fromTo(
      heroMedia,
      { yPercent: -5, force3D: true },
      { yPercent: 0, ease: "none", duration: 1, force3D: true },
      0,
    );

  return {
    timeline,
    heroCopy,
    heroTransform,
    heroShell,
    heroMedia,
    heroImage,
    setHeroMotionState,
  };
}

function initArchiveScroll(intro, track) {
  if (!track) return null;

  const distance = () => getArchiveScrollDistance(track);
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".archive",
      start: "top top",
      end: () => `+=${Math.max(distance(), 1)}`,
      pin: true,
      pinType: "fixed",
      pinSpacing: true,
      scrub: 0.65,
      anticipatePin: 1,
      refreshPriority: 2,
      invalidateOnRefresh: true,
    },
  });

  timeline.to(track, { x: () => -distance(), ease: "none" }, 0);

  if (intro) {
    timeline.to(intro, { yPercent: -12, ease: "none" }, 0);
  }

  gsap.utils.toArray(".archive-card img").forEach((image, index) => {
    timeline.fromTo(
      image,
      { yPercent: index % 2 === 0 ? -6 : -12 },
      { yPercent: index % 2 === 0 ? 8 : 4, ease: "none" },
      0,
    );
  });

  return timeline;
}

function initScrollAnimations() {
  mm.add("(min-width: 769px)", () => {
    const hero = document.querySelector(".hero");
    const heroContainer = document.querySelector(".hero-container");
    const heroImage = document.querySelector(".hero-image");
    const heroShell = document.querySelector(".hero-facade-shell");
    const archiveIntro = document.querySelector(".archive-intro");
    const archiveTrack = document.getElementById("archiveTrack");

    const heroHandoff = initHeroHandoff({
      hero,
      heroContainer,
      heroImage,
      heroShell,
    });

    const archiveTimeline = initArchiveScroll(archiveIntro, archiveTrack);

    initWorksAnimations(false);
    const worksHoverCleanups = initWorksFigureHover();

    return () => {
      document.body.classList.remove("is-hero-pinned");
      heroHandoff?.timeline?.scrollTrigger?.kill();
      heroHandoff?.timeline?.kill();
      heroHandoff?.setHeroMotionState(false);
      archiveTimeline?.scrollTrigger?.kill();
      archiveTimeline?.kill();
      worksHoverCleanups.forEach((cleanup) => cleanup());
      gsap.set(
        [
          heroContainer,
          heroHandoff?.heroCopy,
          heroImage,
          heroHandoff?.heroTransform,
          heroShell,
          heroHandoff?.heroMedia,
          archiveTrack,
          ".archive-intro",
          ".archive-card img",
        ].filter(Boolean),
        {
          clearProps: "transform,opacity,willChange",
        },
      );
    };
  });

  mm.add("(max-width: 768px)", () => {
    const archiveIntro = document.querySelector(".archive-intro");

    let archiveIntroTween;
    if (archiveIntro) {
      archiveIntroTween = gsap.from(archiveIntro, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: archiveIntro,
          start: "top 90%",
        },
      });
    }

    const cardCleanups = gsap.utils.toArray(".archive-card").map((card, index) => {
      const tween = gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
        },
      });

      return () => tween.kill();
    });

    initWorksAnimations(true);

    return () => {
      cardCleanups.forEach((cleanup) => cleanup());
      archiveIntroTween?.kill();
      gsap.set([archiveIntro, ".archive-card"].filter(Boolean), {
        clearProps: "transform,opacity",
      });
    };
  });
}

function initWorksFigureHover() {
  return gsap.utils.toArray(".works-figure").map((figure) => {
    const visual = figure.querySelector(".works-visual");
    const image = figure.querySelector(".works-visual img");
    const caption = figure.querySelector(".works-cap");
    const xTo = gsap.quickTo(figure, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(figure, "y", {
      duration: 0.45,
      ease: "power3.out",
    });
    const rotateXTo = gsap.quickTo(figure, "rotationX", {
      duration: 0.55,
      ease: "power3.out",
    });
    const rotateYTo = gsap.quickTo(figure, "rotationY", {
      duration: 0.55,
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
      rotateXTo(relY * -4);
      rotateYTo(relX * 5);
      imgXTo(relX * -4);

      if (visual) {
        gsap.to(visual, {
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
      gsap.set(figure, { transformPerspective: 900 });
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
      gsap.to(visual, {
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

    figure.addEventListener("mouseenter", onEnter);
    figure.addEventListener("mousemove", onMove);
    figure.addEventListener("mouseleave", onLeave);

    return () => {
      figure.removeEventListener("mouseenter", onEnter);
      figure.removeEventListener("mousemove", onMove);
      figure.removeEventListener("mouseleave", onLeave);
      gsap.set([figure, visual, caption].filter(Boolean), {
        clearProps: "transform,color",
      });
    };
  });
}

let pageScrollInitialized = false;
let scrollRefreshTimer;

function refreshScrollLayout() {
  updateStableViewportHeight();
  clearManifestoWidthCache();
  ScrollTrigger.refresh(true);
  updateScrollState();
}

function scheduleScrollRefresh() {
  window.clearTimeout(scrollRefreshTimer);
  scrollRefreshTimer = window.setTimeout(() => {
    const refresh = () => requestAnimationFrame(refreshScrollLayout);

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(refresh);
    } else {
      refresh();
    }
  }, isHeroPinned() ? 180 : 80);
}

function initPageScroll() {
  if (pageScrollInitialized) return;
  pageScrollInitialized = true;

  initScrollAnimations();
  initManifestoReveal();

  scheduleScrollRefresh();

  if (document.readyState === "complete") {
    scheduleScrollRefresh();
  } else {
    window.addEventListener("load", scheduleScrollRefresh, { once: true });
  }
}

function initAnimations() {
  initMorphButtons();
  initHeroFacade();
  initTextHoverEffects();
}
