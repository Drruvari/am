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
      duration: 1,
      delay: Number.parseFloat(first.dataset.revealDelay || "0"),
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: first.dataset.revealStart || "top 82%",
        toggleActions: "play none none reverse",
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

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    const configuredStrength = Number.parseFloat(
      element.dataset.parallax || "20",
    );
    const strength = isMobile ? configuredStrength * 0.55 : configuredStrength;

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
          scrub: isMobile ? true : 1,
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
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
    });
  });

  addCleanup(() => splits.forEach((split) => split.revert()));
}

export function refreshScrollStory() {
  window.requestAnimationFrame(() => ScrollTrigger.refresh(true));
}
