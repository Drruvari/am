const LOGO_EYE = {
  pupilHoverScale: 0.965,
  pupilHoverXOffset: 24,
  clipStates: {
    right: { fromY: 672, toY: 444, fromH: 0, toH: 228 },
    left: { fromY: 672, toY: 449, fromH: 0, toH: 223 },
  },
  pupilCenters: [
    { cx: 2518, cy: 407 },
    { cx: 1731, cy: 407 },
  ],
};

function getLogoEyeElements(svg, idPrefix = "") {
  const rightClip = svg.querySelector(`#${idPrefix}rightLidReveal`);
  const leftClip = svg.querySelector(`#${idPrefix}leftLidReveal`);
  const rightPupil = svg.querySelector(`#${idPrefix}rightPupil`);
  const leftPupil = svg.querySelector(`#${idPrefix}leftPupil`);

  if (!rightClip || !leftClip || !rightPupil || !leftPupil) return null;

  return { rightClip, leftClip, rightPupil, leftPupil };
}

function setLogoEyeProgress(elements, progress) {
  const scale = 1 + (LOGO_EYE.pupilHoverScale - 1) * progress;
  const x = LOGO_EYE.pupilHoverXOffset * progress;
  const pupils = [elements.rightPupil, elements.leftPupil];

  pupils.forEach((node, index) => {
    const { cx, cy } = LOGO_EYE.pupilCenters[index];
    node.setAttribute(
      "transform",
      `translate(${x} 0) translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`,
    );
  });
}

function resetLogoEye(elements) {
  const { clipStates } = LOGO_EYE;

  elements.rightClip.setAttribute("y", String(clipStates.right.fromY));
  elements.rightClip.setAttribute("height", String(clipStates.right.fromH));
  elements.leftClip.setAttribute("y", String(clipStates.left.fromY));
  elements.leftClip.setAttribute("height", String(clipStates.left.fromH));
  setLogoEyeProgress(elements, 0);
}

function addLogoEyeReveal(timeline, elements, options = {}) {
  const {
    duration = 0.5,
    position = 0,
    ease = "power2.out",
    onProgress,
  } = options;
  const { clipStates } = LOGO_EYE;
  const state = { p: 0 };
  const pupilPosition =
    typeof position === "number" ? position + 0.03 : `${position}+=0.03`;

  timeline.to(
    elements.rightClip,
    {
      attr: { y: clipStates.right.toY, height: clipStates.right.toH },
      duration,
      ease,
    },
    position,
  );

  timeline.to(
    elements.leftClip,
    {
      attr: { y: clipStates.left.toY, height: clipStates.left.toH },
      duration,
      ease,
    },
    position,
  );

  timeline.to(
    state,
    {
      p: 1,
      duration,
      ease,
      onUpdate: () => {
        setLogoEyeProgress(elements, state.p);
        onProgress?.(state.p);
      },
    },
    pupilPosition,
  );

  return timeline;
}

function createLogoEyeHoverTimeline(svg, duration = 0.5, idPrefix = "") {
  const elements = getLogoEyeElements(svg, idPrefix);
  if (!elements || !window.gsap) return null;

  resetLogoEye(elements);

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onReverseComplete: () => setLogoEyeProgress(elements, 0),
  });

  addLogoEyeReveal(timeline, elements, { duration });
  return timeline;
}
