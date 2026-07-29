import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.scss";

const OPEN_PATH = "M 0 0 V 0 Q 50 0 100 0 V 0 z";
const COVER_PATH = "M 0 0 V 100 Q 50 100 100 100 V 0 z";
const LEAVE_START = "M 0 100 V 100 Q 50 100 100 100 V 100 z";
const LEAVE_MID = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
const LEAVE_END = "M 0 100 V 0 Q 50 0 100 0 V 100 z";
const ENTER_MID = "M 0 0 V 50 Q 50 0 100 50 V 0 z";

export default function PageTransition() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // iOS Safari stalls GSAP SVG path morphs and can leave a full black cover.
    const isTouchUi = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;
    const skipMorph = reduceMotion || isTouchUi;

    let enterFailsafe: number | undefined;
    let leaveFailsafe: number | undefined;

    const clearOverlay = () => {
      gsap.killTweensOf(path);
      path.setAttribute("d", OPEN_PATH);
      svg.style.visibility = "hidden";
      // Nudge iOS to drop a stale covered compositor layer.
      void svg.getBoundingClientRect();
    };

    const armOverlay = () => {
      svg.style.visibility = "visible";
    };

    clearOverlay();

    if (!skipMorph) {
      armOverlay();
      gsap
        .timeline({ onComplete: clearOverlay })
        .set(path, { attr: { d: COVER_PATH } })
        .to(path, {
          duration: 0.36,
          ease: "power2.in",
          attr: { d: ENTER_MID },
        })
        .to(path, {
          duration: 0.55,
          ease: "power4.out",
          attr: { d: OPEN_PATH },
        });

      enterFailsafe = window.setTimeout(clearOverlay, 1200);
    }

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

      const go = () => {
        if (leaveFailsafe !== undefined) {
          window.clearTimeout(leaveFailsafe);
          leaveFailsafe = undefined;
        }
        window.location.assign(destination.href);
      };

      // Skip morph on touch — navigate immediately so the next page never
      // inherits a stuck black cover from a stalled leave wipe.
      if (skipMorph) {
        clearOverlay();
        go();
        return;
      }

      armOverlay();
      gsap.killTweensOf(path);
      gsap
        .timeline({ onComplete: go })
        .set(path, { attr: { d: LEAVE_START } })
        .to(path, {
          duration: 0.5,
          ease: "power4.in",
          attr: { d: LEAVE_MID },
        })
        .to(path, {
          duration: 0.3,
          ease: "power2.out",
          attr: { d: LEAVE_END },
        });

      leaveFailsafe = window.setTimeout(go, 1200);
    };

    document.addEventListener("click", onNavigate);
    return () => {
      if (enterFailsafe !== undefined) window.clearTimeout(enterFailsafe);
      if (leaveFailsafe !== undefined) window.clearTimeout(leaveFailsafe);
      document.removeEventListener("click", onNavigate);
      gsap.killTweensOf(path);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="page-transition"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ visibility: "hidden" }}
    >
      <path
        ref={pathRef}
        vectorEffect="non-scaling-stroke"
        d={OPEN_PATH}
      />
    </svg>
  );
}
