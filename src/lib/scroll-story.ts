import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { addCleanup } from "./cleanup";

type RevealPreset = "up" | "up-large" | "fade" | "mask" | "line";

const PRESETS: Record<RevealPreset, gsap.TweenVars> = {
  up: { y: 32, autoAlpha: 0 },
  "up-large": { y: 72, autoAlpha: 0, clipPath: "inset(12% 0% 0% 0%)" },
  fade: { autoAlpha: 0 },
  mask: { clipPath: "inset(0% 0% 100% 0%)" },
  line: { yPercent: 110, autoAlpha: 0 },
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initScrollStory(root: ParentNode = document) {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]"),
  );

  if (prefersReducedMotion()) {
    gsap.set(elements, { clearProps: "all", autoAlpha: 1 });
    return;
  }

  const groups = new Map<string, HTMLElement[]>();
  const ungrouped: HTMLElement[] = [];
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  elements.forEach((element) => {
    const groupName = element.dataset.revealGroup;
    if (!groupName) {
      ungrouped.push(element);
      return;
    }

    const group = groups.get(groupName) ?? [];
    group.push(element);
    groups.set(groupName, group);
  });

  const animate = (targets: HTMLElement[], trigger: HTMLElement) => {
    const first = targets[0];
    const preset = (first.dataset.reveal as RevealPreset) || "up";
    const from = PRESETS[preset] ?? PRESETS.up;

    gsap.set(targets, from);
    gsap.to(targets, {
      y: 0,
      yPercent: 0,
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: isMobile ? 0.65 : 1,
      delay: Number.parseFloat(first.dataset.revealDelay || "0"),
      stagger: isMobile ? 0.045 : 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: first.dataset.revealStart || (isMobile ? "top 90%" : "top 82%"),
        once: isMobile,
        toggleActions: isMobile ? "play none none none" : "play none none reverse",
      },
    });
  };

  groups.forEach((targets) => {
    animate(targets, targets[0].closest("section, footer") ?? targets[0]);
  });
  ungrouped.forEach((element) => animate([element], element));
}

export function initParallax(root: ParentNode = document) {
  if (prefersReducedMotion()) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) return;

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    const configuredStrength = Number.parseFloat(
      element.dataset.parallax || "20",
    );
    const strength = configuredStrength;

    gsap.fromTo(
      element,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger:
            element.closest("figure, .project-card__media") ?? element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

export function initLineReveals(
  selector = "[data-split-lines]",
  root: ParentNode = document,
) {
  const splits: SplitType[] = [];

  if (prefersReducedMotion()) return;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    const split = new SplitType(element, { types: "lines", tagName: "span" });
    const lines = (split.lines ?? []) as HTMLElement[];
    if (!lines.length) {
      split.revert();
      return;
    }

    splits.push(split);
    gsap.set(lines, { display: "block", yPercent: 105, autoAlpha: 0 });
    gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: isMobile ? 0.65 : 0.9,
        stagger: isMobile ? 0.045 : 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: isMobile ? "top 90%" : "top 80%",
          once: isMobile,
          toggleActions: isMobile
            ? "play none none none"
            : "play none none reverse",
        },
    });
  });

  addCleanup(() => splits.forEach((split) => split.revert()));
}

export function refreshScrollStory() {
  window.requestAnimationFrame(() => ScrollTrigger.refresh(true));
}
