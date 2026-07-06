function initLogoHover() {
  const logo = document.querySelector(".topbar-logo");
  const hoverHost = logo?.querySelector(".topbar-logo-hover");
  const defaultImg = logo?.querySelector(".topbar-logo-img--default");

  if (!logo || !hoverHost || !defaultImg) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointerQuery = window.matchMedia("(pointer: fine)");

  let hoverPaths = [];
  let hoverTL = null;
  let isHovering = false;
  let isReady = false;
  let touchDrawActive = false;

  const DRAW_DURATION = prefersReducedMotion ? 0 : 5;
  const DRAW_STAGGER = prefersReducedMotion ? 0 : 0.12;
  const UNDRAW_DURATION = prefersReducedMotion ? 0 : 3.5;
  const UNDRAW_STAGGER = prefersReducedMotion ? 0 : 0.1;
  const FADE_DURATION = 0.9;

  const sortPathsLeftToRight = (paths) => {
    try {
      return paths.slice().sort((a, b) => {
        const boxA = a.getBBox();
        const boxB = b.getBBox();
        return boxA.x + boxA.width * 0.5 - (boxB.x + boxB.width * 0.5);
      });
    } catch {
      return paths;
    }
  };

  const getStrokeColor = (path) => {
    const fill = path.getAttribute("fill");
    return fill === "#EDEDEB" || fill === "white" ? "#111213" : fill || "#111213";
  };

  const setDrawState = (path, drawn = false) => {
    const length = Number(path.dataset.length);
    if (!length) return;

    path.style.vectorEffect = "non-scaling-stroke";

    gsap.set(path, {
      fill: "none",
      stroke: path.dataset.stroke,
      strokeWidth: 2.25,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: length,
      strokeDashoffset: drawn ? 0 : length,
      opacity: 1,
    });
  };

  const setFilledState = (paths) => {
    paths.forEach((path) => {
      path.style.vectorEffect = "";

      gsap.set(path, {
        fill: path.dataset.fill,
        stroke: "none",
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeDashoffset: 0,
        opacity: 1,
      });
    });
  };

  const resetHover = () => {
    hoverTL?.kill();
    hoverTL = null;
    isHovering = false;
    touchDrawActive = false;
    logo.classList.remove("is-hovering", "is-drawing");

    gsap.set(hoverHost, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(defaultImg, { autoAlpha: 1 });

    if (hoverPaths.length) {
      setFilledState(hoverPaths);
    }
  };

  const preparePaths = (paths) => {
    return paths.filter((path) => {
      const length = path.getTotalLength();
      if (length < 8) return false;

      path.dataset.length = String(length);
      path.dataset.fill = path.getAttribute("fill") || "#111213";
      path.dataset.stroke = getStrokeColor(path);
      return true;
    });
  };

  const showStaticHover = () => {
    gsap.set(hoverHost, { autoAlpha: 1, pointerEvents: "none" });
    gsap.set(defaultImg, { autoAlpha: 0 });
    logo.classList.add("is-hovering");
    isHovering = true;
  };

  const playHoverIn = () => {
    if (!isReady || isHovering) return;

    if (prefersReducedMotion) {
      showStaticHover();
      return;
    }

    hoverTL?.kill();
    isHovering = true;
    logo.classList.add("is-hovering", "is-drawing");

    hoverPaths.forEach((path) => setDrawState(path, false));
    gsap.set(hoverHost, { autoAlpha: 1, pointerEvents: "none" });

    if (!finePointerQuery.matches) {
      touchDrawActive = true;
    }

    hoverTL = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      onComplete: () => {
        if (!isHovering) return;
        logo.classList.remove("is-drawing");
        setFilledState(hoverPaths);
        touchDrawActive = false;
      },
    });

    hoverTL.to(
      defaultImg,
      {
        autoAlpha: 0,
        duration: FADE_DURATION,
        ease: "power2.out",
      },
      DRAW_DURATION * 0.45,
    );

    hoverTL.to(
      hoverPaths,
      {
        strokeDashoffset: 0,
        duration: DRAW_DURATION,
        stagger: DRAW_STAGGER,
      },
      0,
    );
  };

  const playHoverOut = () => {
    if (!isReady || !isHovering) return;
    if (!finePointerQuery.matches && touchDrawActive) return;

    if (!hoverPaths.length || prefersReducedMotion) {
      resetHover();
      return;
    }

    hoverTL?.kill();
    isHovering = false;
    logo.classList.remove("is-hovering");
    logo.classList.add("is-drawing");

    hoverPaths.forEach((path) => setDrawState(path, true));

    hoverTL = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      onComplete: resetHover,
    });

    hoverTL.to(
      defaultImg,
      {
        autoAlpha: 1,
        duration: FADE_DURATION,
        ease: "power2.inOut",
      },
      UNDRAW_DURATION * 0.2,
    );

    hoverTL.to(
      [...hoverPaths].reverse(),
      {
        strokeDashoffset: (index, target) => Number(target.dataset.length),
        duration: UNDRAW_DURATION,
        stagger: UNDRAW_STAGGER,
      },
      0,
    );
  };

  const setupHoverSvg = (svg) => {
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("topbar-logo-svg");

    hoverPaths = sortPathsLeftToRight(
      preparePaths(gsap.utils.toArray("path", svg)),
    );
    resetHover();
    isReady = true;
  };

  const onPointerLeave = () => {
    if (!finePointerQuery.matches && touchDrawActive) return;
    playHoverOut();
  };

  const onDocumentPointerDown = (event) => {
    if (finePointerQuery.matches) return;
    if (logo.contains(event.target) || !isHovering || touchDrawActive) return;
    playHoverOut();
  };

  const bindEvents = () => {
    if (finePointerQuery.matches) {
      logo.addEventListener("pointerenter", playHoverIn);
      logo.addEventListener("pointerleave", onPointerLeave);
      return;
    }

    logo.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;

      if (isHovering) {
        if (!touchDrawActive) playHoverOut();
        return;
      }

      playHoverIn();
    });

    document.addEventListener("pointerdown", onDocumentPointerDown);
  };

  const inlineSvg = hoverHost.querySelector("svg");

  if (inlineSvg) {
    requestAnimationFrame(() => {
      setupHoverSvg(inlineSvg);
      bindEvents();
    });
    return;
  }

  fetch("assets/logo-hover.svg")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load hover logo");
      return response.text();
    })
    .then((svgText) => {
      hoverHost.innerHTML = svgText;
      const svg = hoverHost.querySelector("svg");
      if (!svg) throw new Error("Hover logo SVG missing");
      setupHoverSvg(svg);
      bindEvents();
    })
    .catch(() => {
      isReady = true;
      bindEvents();
    });
}
