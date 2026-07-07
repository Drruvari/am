function initLogoHover() {
  const logo = document.querySelector(".site-header__logo");
  const svg = logo?.querySelector(".site-header__logo-svg svg");

  if (!logo || !svg) return;

  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("site-header__logo-svg-el");

  const hoverTL = createLogoEyeHoverTimeline(svg, 0.5);
  if (!hoverTL) return;

  logo.addEventListener("pointerenter", () => hoverTL.play());
  logo.addEventListener("pointerleave", () => hoverTL.reverse());
}
