function initScrambleText() {
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

function syncTopbarActionMotion(isCompact) {
  const brief = document.querySelector(".topbar-brief-wrap");
  const menu = document.querySelector(".topbar-menu-wrap");
  if (!brief || !menu) return;

  gsap.killTweensOf([brief, menu]);

  if (!desktopQuery.matches) {
    gsap.set([brief, menu], { clearProps: "all" });
    return;
  }

  const actions = document.querySelector(".topbar-actions");
  if (!actions) return;

  const styles = getComputedStyle(actions);
  const rootFontSize =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const toPx = (value) => {
    const numeric = parseFloat(value);
    if (!Number.isFinite(numeric)) return 0;
    return value.trim().endsWith("rem") ? numeric * rootFontSize : numeric;
  };
  const gap = toPx(styles.getPropertyValue("--topbar-action-gap"));
  const shift = menu.offsetWidth + gap;

  if (isCompact) {
    gsap.set(brief, {
      x: shift,
      y: 0,
      scale: 1,
      opacity: 1,
      visibility: "visible",
    });
    gsap.set(menu, {
      x: shift,
      y: 0,
      scale: 0.98,
      opacity: 1,
      visibility: "visible",
    });
    gsap.fromTo(
      [brief, menu],
      { x: shift },
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.46,
        ease: "back.out(1.55)",
        overwrite: "auto",
      },
    );
    return;
  }

  gsap.set(menu, { x: 0, y: 0, scale: 1, opacity: 1, visibility: "visible" });
  gsap.set(brief, { x: -shift, y: 0, scale: 1, opacity: 1 });

  gsap.to(brief, {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 0.42,
    ease: "back.in(1.25)",
    overwrite: "auto",
  });
  gsap.to(menu, {
    x: shift,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 0.42,
    ease: "back.in(1.25)",
    overwrite: "auto",
    onComplete: () => {
      gsap.set(menu, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        visibility: "hidden",
      });
    },
  });
}

function initMorphButtons() {
  ensureLiquidFilter();
  morphButtons = gsap.utils.toArray(".morph-btn");

  morphButtons.forEach((btn) => {
    if (btn.dataset.morphReady === "true") return;
    btn.dataset.morphReady = "true";

    const layer = document.createElement("span");
    const body = document.createElement("span");
    const satA = document.createElement("span");
    const satB = document.createElement("span");
    const content = btn.querySelector(".morph-btn__content");
    const interactive = btn.querySelector("a, button");
    let isHovering = false;
    let lastVector = { x: 1, y: 0 };
    const getVector = () => btn._fluidVector || lastVector;

    layer.className = "morph-btn__rings";
    body.className = "morph-btn__body";
    satA.className = "morph-btn__sat morph-btn__sat--a";
    satB.className = "morph-btn__sat morph-btn__sat--b";
    layer.setAttribute("aria-hidden", "true");
    layer.append(body, satA, satB);
    btn.prepend(layer);

    const fluidTargets = [btn, layer, body, satA, satB, content].filter(Boolean);

    const setHoverState = (active) => {
      if (isHovering === active) return;
      isHovering = active;
      gsap.killTweensOf(fluidTargets);

      if (active) {
        const vector = getVector();
        btn.classList.add("is-hover");
        gsap.to(layer, {
          scale: 1.025,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(body, {
          scaleX: 1.035,
          scaleY: 0.98,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(satA, {
          x: vector.x * 18,
          y: vector.y * 12,
          opacity: 1,
          scale: 0.95,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(satB, {
          x: vector.x * -14,
          y: vector.y * -8 + 5,
          opacity: 1,
          scale: 0.82,
          duration: 0.44,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (content) {
          gsap.to(content, {
            y: -1,
            duration: 0.42,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        return;
      }

      btn.classList.remove("is-hover");
      gsap.to([btn, layer, body, content].filter(Boolean), {
        x: 0,
        y: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.78,
        ease: "elastic.out(1.05, 0.45)",
        overwrite: "auto",
      });
      gsap.to([satA, satB], {
        x: 0,
        y: 0,
        opacity: 0,
        scale: 1,
        duration: 0.72,
        ease: "elastic.out(1.05, 0.42)",
        overwrite: "auto",
      });
    };

    const splash = () => {
      const vector = getVector();
      gsap.fromTo(
        body,
        { scaleX: 0.88, scaleY: 0.88 },
        {
          scaleX: isHovering ? 1.05 : 1,
          scaleY: isHovering ? 0.96 : 1,
          duration: 0.55,
          ease: "elastic.out(1.2, 0.35)",
          overwrite: "auto",
        },
      );
      gsap.fromTo(
        [satA, satB],
        {
          x: (index) => vector.x * (index === 0 ? 58 : -46),
          y: (index) => vector.y * (index === 0 ? 42 : -34),
          opacity: 1,
          scale: 0.42,
        },
        {
          x: 0,
          y: 0,
          opacity: isHovering ? 1 : 0,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1.1, 0.42)",
          overwrite: "auto",
        },
      );
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
      interactive.addEventListener("pointerdown", splash);
    }
  });

  mm.add("(min-width: 769px) and (pointer: fine)", () => {
    const cleanups = [];

    morphButtons.forEach((btn) => {
      const content = btn.querySelector(".morph-btn__content");
      const body = btn.querySelector(".morph-btn__body");
      const satA = btn.querySelector(".morph-btn__sat--a");
      const satB = btn.querySelector(".morph-btn__sat--b");
      const pull = btn.classList.contains("morph-btn--rect") ? 0.16 : 0.12;
      const labelPull = pull * 0.36;

      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.max(Math.hypot(x, y), 1);
        const threshold = Math.max(rect.width, rect.height) * 1.75;
        const power = gsap.utils.clamp(
          0.35,
          1,
          (threshold - distance) / threshold,
        );
        const nx = x / distance;
        const ny = y / distance;
        btn._fluidVector = { x: nx, y: ny };

        gsap.to(btn, {
          x: x * pull,
          y: y * pull,
          duration: 0.34,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(body, {
          scaleX: 1 + Math.abs(nx) * power * 0.11,
          scaleY: 1 + Math.abs(ny) * power * 0.075,
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(satA, {
          x: nx * power * 34,
          y: ny * power * 24,
          opacity: 1,
          scale: 0.95,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(satB, {
          x: Math.cos(Math.atan2(y, x) - 0.35) * power * 26,
          y: Math.sin(Math.atan2(y, x) - 0.35) * power * 20,
          opacity: 1,
          scale: 0.8,
          duration: 0.34,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (content) {
          gsap.to(content, {
            x: x * labelPull,
            y: y * labelPull,
            duration: 0.34,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        gsap.to([btn, body, content].filter(Boolean), {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.78,
          ease: "elastic.out(1, 0.45)",
          overwrite: "auto",
        });
        gsap.to([satA, satB].filter(Boolean), {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 0,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        gsap.set([btn, body, satA, satB, content].filter(Boolean), {
          clearProps: "transform,opacity",
        });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

function initScrollAnimations() {
  const manifestoSplit = new SplitType("#manifestoText", { types: "words" });

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

  gsap.utils.toArray(".works-head").forEach((block) => {
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
  initScrambleText();
  initScrollAnimations();
}
