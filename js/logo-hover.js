function initLogoHover() {
  const logo = document.querySelector(".topbar-logo");
  const svg = logo?.querySelector(".topbar-logo-svg-host svg");

  if (!logo || !svg) return;

  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("topbar-logo-svg");

  const hoverTL = createLogoEyeHoverTimeline(svg, 0.5);
  if (!hoverTL) return;

  logo.addEventListener("pointerenter", () => hoverTL.play());
  logo.addEventListener("pointerleave", () => hoverTL.reverse());
}
