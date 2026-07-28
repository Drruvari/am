import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.scss";

export default function PageTransition() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap
      .timeline()
      .set(path, {
        attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      })
      .to(path, {
        duration: reduceMotion ? 0.01 : 0.36,
        ease: "power2.in",
        attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
      })
      .to(path, {
        duration: reduceMotion ? 0.01 : 0.55,
        ease: "power4.out",
        attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      });

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
        d="M 0 0 V 100 Q 50 100 100 100 V 0 z"
      />
    </svg>
  );
}
