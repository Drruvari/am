var mm;
var desktopQuery;
var finePointerQuery;
var morphButtons = [];
var themeMetrics = [];

function initTheme() {
  measureThemeSections();
  updateDynamicTheme(0);
}

function measureThemeSections() {
  const themeSections = gsap.utils
    .toArray("[data-theme-bg]")
    .map((section) => ({
      section,
      bg: hexToRgb(section.dataset.themeBg),
      fg: hexToRgb(section.dataset.themeFg),
      panel: hexToRgb(section.dataset.themePanel),
    }));

  themeMetrics = themeSections.map(({ section, bg, fg, panel }) => ({
    section,
    bg,
    fg,
    panel,
    start: section.offsetTop,
    end: section.offsetTop + section.offsetHeight,
  }));
}

function updateDynamicTheme(scrollY = window.scrollY) {
  if (!themeMetrics.length) return;

  const root = document.documentElement;
  const heroSection = document.getElementById("hero");
  if (
    heroSection &&
    scrollY <
      Math.max(heroSection.offsetHeight * 0.72, window.innerHeight * 0.55)
  ) {
    const heroTheme = themeMetrics.find(
      (entry) => entry.section === heroSection,
    );
    if (heroTheme) {
      applyThemeColors(heroTheme.bg, heroTheme.fg, heroTheme.panel);
      return;
    }
  }

  const probe = scrollY + window.innerHeight * 0.35;
  let index = 0;

  for (let i = themeMetrics.length - 1; i >= 0; i -= 1) {
    if (probe >= themeMetrics[i].start) {
      index = i;
      break;
    }
  }

  const current = themeMetrics[index];
  const next = themeMetrics[index + 1];
  const blendStart = current.start + current.section.offsetHeight * 0.35;
  const blendEnd = next
    ? next.start + next.section.offsetHeight * 0.15
    : current.end;
  const span = Math.max(blendEnd - blendStart, 1);
  const t = next ? gsap.utils.clamp(0, 1, (probe - blendStart) / span) : 0;

  applyThemeColors(
    mixRgb(current.bg, next?.bg ?? current.bg, t),
    mixRgb(current.fg, next?.fg ?? current.fg, t),
    mixRgb(current.panel, next?.panel ?? current.panel, t),
  );
}

function applyThemeColors(bg, fg, panel) {
  const root = document.documentElement;
  root.style.setProperty("--bg", rgbToHex(bg));
  root.style.setProperty("--fg", rgbToHex(fg));
  root.style.setProperty("--panel", rgbToHex(panel));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const chunk = value.length === 3 ? 1 : 2;
  const read = (start) => {
    const part = value.slice(start, start + chunk);
    return parseInt(chunk === 1 ? part + part : part, 16);
  };

  return { r: read(0), g: read(chunk), b: read(chunk * 2) };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(gsap.utils.clamp(0, 255, channel))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function initGlobalUI() {
  document.getElementById("footerYear").textContent =
    new Date().getFullYear();

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
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Flip);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  desktopQuery = window.matchMedia("(min-width: 769px)");
  finePointerQuery = window.matchMedia(
    "(min-width: 769px) and (pointer: fine)",
  );
  mm = gsap.matchMedia();

  initTheme();
  initSmoothScroll();
  initCursor();
  initAnimations();
  initLoader();
  initMobileMenu();
  initProjectDetail();
  initGlobalUI();
});
