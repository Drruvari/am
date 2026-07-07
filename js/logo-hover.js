function initLogoHover() {
  const logo = document.querySelector(".topbar-logo");
  const svgHost = logo?.querySelector(".topbar-logo-svg-host");
  const svg = svgHost?.querySelector("svg");

  if (!logo || !svg) return;

  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("topbar-logo-svg");

  const rightClip = svg.querySelector("#rightLidReveal");
  const leftClip = svg.querySelector("#leftLidReveal");
  const rightPupil = svg.querySelector("#rightPupil");
  const leftPupil = svg.querySelector("#leftPupil");

  if (!rightClip || !leftClip || !rightPupil || !leftPupil) return;

  const pupilHoverScale = 0.965;
  const pupilHoverXOffset = 24;
  const duration = 0.5;

  const clipStates = {
    right: { fromY: 672, toY: 444, fromH: 0, toH: 228 },
    left: { fromY: 672, toY: 449, fromH: 0, toH: 223 },
  };

  const pupilTransforms = [
    { node: rightPupil, cx: 2518, cy: 407 },
    { node: leftPupil, cx: 1731, cy: 407 },
  ];

  let hoverTL = null;
  let progress = 0;
  let target = 0;
  let raf = null;

  const setPupilTransform = (value) => {
    const scale = 1 + (pupilHoverScale - 1) * value;
    const x = pupilHoverXOffset * value;

    pupilTransforms.forEach(({ node, cx, cy }) => {
      node.setAttribute(
        "transform",
        `translate(${x} 0) translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`,
      );
    });
  };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t;

  const render = (value) => {
    const e = easeOut(value);

    rightClip.setAttribute(
      "y",
      String(lerp(clipStates.right.fromY, clipStates.right.toY, e)),
    );
    rightClip.setAttribute(
      "height",
      String(lerp(clipStates.right.fromH, clipStates.right.toH, e)),
    );
    leftClip.setAttribute(
      "y",
      String(lerp(clipStates.left.fromY, clipStates.left.toY, e)),
    );
    leftClip.setAttribute(
      "height",
      String(lerp(clipStates.left.fromH, clipStates.left.toH, e)),
    );
    setPupilTransform(e);
  };

  const animateTo = (to) => {
    target = to;
    const start = progress;
    const startTime = performance.now();
    const ms = duration * 1000;

    cancelAnimationFrame(raf);

    const tick = (now) => {
      const local = ms <= 0 ? 1 : Math.min(1, (now - startTime) / ms);
      progress = lerp(start, target, local);
      render(progress);

      if (local < 1) {
        raf = requestAnimationFrame(tick);
      } else if (target === 0) {
        setPupilTransform(0);
      }
    };

    raf = requestAnimationFrame(tick);
  };

  setPupilTransform(0);

  if (window.gsap) {
    const state = { p: 0 };

    hoverTL = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
    });

    hoverTL.to(
      rightClip,
      {
        attr: { y: clipStates.right.toY, height: clipStates.right.toH },
        duration,
      },
      0,
    );

    hoverTL.to(
      leftClip,
      {
        attr: { y: clipStates.left.toY, height: clipStates.left.toH },
        duration,
      },
      0,
    );

    hoverTL.to(
      state,
      {
        p: 1,
        duration,
        onUpdate: () => setPupilTransform(state.p),
        onReverseComplete: () => setPupilTransform(0),
      },
      0.03,
    );
  }

  const playIn = () => {
    if (hoverTL) {
      hoverTL.play();
      return;
    }

    animateTo(1);
  };

  const playOut = () => {
    if (hoverTL) {
      hoverTL.reverse();
      return;
    }

    animateTo(0);
  };

  logo.addEventListener("pointerenter", playIn);
  logo.addEventListener("pointerleave", playOut);
}
