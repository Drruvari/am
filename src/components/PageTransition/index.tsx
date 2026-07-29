import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.scss";

/**
 * Leave-only fade overlay. No SVG path morphs — those stall on iOS Safari and
 * can leave a full-viewport black cover on every route.
 */
export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouchUi = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    // Touch: never intercept navigation or paint an overlay.
    if (reduceMotion || isTouchUi) return;

    let leaveFailsafe: number | undefined;

    const hide = () => {
      gsap.killTweensOf(overlay);
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
    };

    hide();

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

      overlay.style.visibility = "visible";
      gsap.killTweensOf(overlay);
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: go,
        },
      );
      leaveFailsafe = window.setTimeout(go, 900);
    };

    document.addEventListener("click", onNavigate);
    return () => {
      if (leaveFailsafe !== undefined) window.clearTimeout(leaveFailsafe);
      document.removeEventListener("click", onNavigate);
      gsap.killTweensOf(overlay);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="page-transition"
      aria-hidden="true"
    />
  );
}
