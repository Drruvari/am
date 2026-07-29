import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.scss";

const OPEN_PATH = "M 0 0 V 0 Q 50 0 100 0 V 0 z";
const COVER_PATH = "M 0 0 V 100 Q 50 100 100 100 V 0 z";

export default function PageTransition() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const openOverlay = () => {
      gsap.killTweensOf(path);
      gsap
        .timeline()
        .set(path, {
          attr: { d: COVER_PATH },
        })
        .to(path, {
          duration: reduceMotion ? 0.01 : 0.36,
          ease: "power2.in",
          attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
        })
        .to(path, {
          duration: reduceMotion ? 0.01 : 0.55,
          ease: "power4.out",
          attr: { d: OPEN_PATH },
        });
    };

    openOverlay();

    // iOS Safari can stall SVG path morphs — force clear so the page isn't stuck black.
    const failsafe = window.setTimeout(() => {
      gsap.killTweensOf(path);
      path.setAttribute("d", OPEN_PATH);
    }, 1800);

    const onNavigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname ||
        destination.protocol === "mailto:"
      ) {
        return;
      }

      event.preventDefault();
      gsap.killTweensOf(path);
      gsap
        .timeline({
          onComplete: () => window.location.assign(destination.href),
        })
        .set(path, {
          attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
        })
        .to(path, {
          duration: reduceMotion ? 0.01 : 0.5,
          ease: "power4.in",
          attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
        })
        .to(path, {
          duration: reduceMotion ? 0.01 : 0.3,
          ease: "power2.out",
          attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
        });
    };

    document.addEventListener("click", onNavigate);
    return () => {
      window.clearTimeout(failsafe);
      document.removeEventListener("click", onNavigate);
      gsap.killTweensOf(path);
    };
  }, []);

  return (
    <svg
      className="page-transition"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        vectorEffect="non-scaling-stroke"
        d={COVER_PATH}
      />
    </svg>
  );
}
