function prepareTextHoverElement(el) {
  if (el.classList.contains("text-hover-target")) return el;

  const styles = getComputedStyle(el);
  const needsInnerWrapper =
    el.matches("a, button") ||
    el.classList.contains("sheet-meta") ||
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
    ".sheet-meta",
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

    trigger.addEventListener("mouseenter", () => setHover(true));
    trigger.addEventListener("mouseleave", () => setHover(false));
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

function initManifestoReveal() {
  if (manifestoRevealInitialized) return;
  manifestoRevealInitialized = true;

  const getImgSpanWidth = (imgSpan) => {
    const img = imgSpan.querySelector("img");
    if (!img) return 0;

    const styles = getComputedStyle(imgSpan);
    const target = styles.getPropertyValue("--manifesto-img-width").trim();
    if (target) {
      const probe = document.createElement("div");
      probe.style.cssText = `position:absolute;visibility:hidden;width:${target};`;
      document.body.appendChild(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    }

    return img.getBoundingClientRect().width;
  };

  const imgSpans = gsap.utils
    .toArray(".manifesto-line")
    .map((line) => line.querySelector(".manifesto-img-span"))
    .filter(Boolean);

  if (!imgSpans.length) return;

  gsap.set(imgSpans, { width: 0 });

  const bindSectionReveal = (start, end, spread = 0.82) => {
    return ScrollTrigger.create({
      trigger: ".manifesto",
      start,
      end,
      scrub: true,
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
      gsap.set(imgSpans, { clearProps: "width" });
    };
  });

  mm.add("(max-width: 768px)", () => {
    gsap.set(imgSpans, { width: 0 });
    const triggers = bindLineReveals("top 88%", "top 68%", 0.5);
    return () => {
      triggers.forEach((trigger) => trigger.kill());
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

function initScrollAnimations() {
  mm.add("(min-width: 769px)", () => {
    const heroContainer = document.querySelector(".hero-container");
    const heroImage = document.querySelector(".hero-image");
    const heroText = document.querySelectorAll(".hero-kicker, .hero-main");
    const sheetsStack = document.getElementById("sheetsStack");
    const getHorizontalDistance = (track, endGap = 80) => {
      return Math.max(
        0,
        track.offsetLeft + track.scrollWidth - window.innerWidth + endGap,
      );
    };

    const heroShell = document.querySelector(".hero-facade-shell");

    // Connected handoff: pin the hero for an extra viewport of scroll. During
    // the pin the text lifts and collapses while the image grows upward to
    // full-bleed, so the scroll reads as pushing into the material before the
    // 01 panel rises directly out of it.
    if (heroContainer && heroImage && heroShell) {
      const getHeroBleed = () => {
        const hero = document.querySelector(".hero");
        if (!hero) return 0;

        return parseFloat(getComputedStyle(hero).paddingLeft) || 0;
      };

      const heroHandoff = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=90%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      heroText.forEach((el) => {
        el.style.overflow = "hidden";
      });

      const heroContainerEl = heroContainer;

      heroHandoff
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
        .to(heroContainerEl, { gap: 0, ease: "power2.in", duration: 0.7 }, 0)
        .fromTo(
          heroShell,
          { flexGrow: 0 },
          { flexGrow: 1, ease: "power2.inOut", duration: 1 },
          0,
        )
        .to(
          heroShell,
          {
            "--hero-shell-bleed": () => `${getHeroBleed()}px`,
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
    }

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

    initWorksAnimations(false);

    return () => {
      if (heroContainer) {
        gsap.set(heroContainer, { clearProps: "transform,opacity" });
      }
      if (heroShell) {
        gsap.set(heroShell, {
          clearProps: "flexGrow,transform,opacity,--hero-shell-bleed",
        });
      }
      if (heroContainer) {
        gsap.set(heroContainer, { clearProps: "gap" });
      }
      heroText.forEach((el) => {
        el.style.overflow = "";
      });
      gsap.set(
        [
          heroImage,
          ...heroText,
          sheetsStack,
          ".sheets-copy",
          ".sheet img",
        ].filter(Boolean),
        {
          clearProps: "transform,opacity,height,margin,padding",
        },
      );
    };
  });

  mm.add("(max-width: 768px)", () => {
    const heroContainer = document.querySelector(".hero-container");
    const heroImage = document.querySelector(".hero-image");
    const heroShell = document.querySelector(".hero-facade-shell");
    const hero = document.querySelector(".hero");
    const heroText = document.querySelectorAll(".hero-kicker, .hero-main");
    const sheetsCopy = document.querySelector(".sheets-copy");
    const getHeroBleed = () =>
      hero ? parseFloat(getComputedStyle(hero).paddingLeft) || 0 : 0;

    if (heroContainer && heroImage && heroShell) {
      heroText.forEach((el) => {
        el.style.overflow = "hidden";
      });

      const heroHandoff = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=75%",
          pin: true,
          pinSpacing: true,
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      heroHandoff
        .to(
          heroText,
          {
            yPercent: -10,
            opacity: 0,
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            ease: "power2.in",
            duration: 0.65,
          },
          0,
        )
        .to(heroContainer, { gap: 0, ease: "power2.in", duration: 0.65 }, 0)
        .fromTo(
          heroShell,
          { flexGrow: 0 },
          { flexGrow: 1, ease: "power2.inOut", duration: 1 },
          0,
        )
        .to(
          heroShell,
          {
            "--hero-shell-bleed": () => `${getHeroBleed()}px`,
            ease: "power2.inOut",
            duration: 0.45,
          },
          0,
        )
        .fromTo(
          heroImage,
          { scale: 1.06 },
          { scale: 1, ease: "none", duration: 1 },
          0,
        );
    }

    if (sheetsCopy) {
      gsap.from(sheetsCopy, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sheetsCopy,
          start: "top 90%",
        },
      });
    }

    const sheetCleanups = gsap.utils.toArray(".sheet").map((sheet, index) => {
      const tween = gsap.from(sheet, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sheet,
          start: "top 92%",
        },
      });

      return () => tween.kill();
    });

    initWorksAnimations(true);

    return () => {
      sheetCleanups.forEach((cleanup) => cleanup());
      heroText.forEach((el) => {
        el.style.overflow = "";
      });
      gsap.set(
        [
          heroContainer,
          heroImage,
          heroShell,
          ...heroText,
          sheetsCopy,
          ".sheet",
        ].filter(Boolean),
        {
          clearProps:
            "transform,opacity,height,margin,padding,gap,flexGrow,--hero-shell-bleed",
        },
      );
    };
  });

  mm.add("(min-width: 769px)", () => {
    const cleanups = gsap.utils.toArray(".works-figure").map((figure) => {
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

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

function initAnimations() {
  initMorphButtons();
  initHeroFacade();
  initTextHoverEffects();
  initScrollAnimations();
}
