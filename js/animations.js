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

function initMorphButtons() {
  morphButtons = gsap.utils.toArray(".morph-btn");

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
}

function initAnimations() {
  initMorphButtons();
  initScrambleText();
  initScrollAnimations();
}
