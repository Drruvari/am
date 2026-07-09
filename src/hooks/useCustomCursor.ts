import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

export type CursorState = "default" | "pointer" | "text";

const HOVER_TO_STATE: Record<string, CursorState> = {
  link: "pointer",
  view: "pointer",
  project: "pointer",
  close: "pointer",
  text: "text",
};

const TEXT_CURSOR_SELECTOR = [
  ".loader__tagline span",
  ".hero__title",
  ".hero__meta",
  ".hero__lede",
  ".manifesto__line > span:not(.manifesto__image)",
  ".archive__intro h2",
  ".archive__intro p",
  ".projects__intro h2",
  ".projects__intro p",
  ".footer-hero-title",
  ".footer-mark",
  ".footer-info-block p",
  ".project-panel__info h3",
  ".project-panel__description",
].join(",");

const DESKTOP_CURSOR_QUERY =
  "(min-width: 769px) and (hover: hover) and (pointer: fine)";

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_CURSOR_QUERY);
    const syncEnabled = () => setEnabled(mediaQuery.matches);

    syncEnabled();
    mediaQuery.addEventListener("change", syncEnabled);
    return () => mediaQuery.removeEventListener("change", syncEnabled);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;

    document.body.classList.add("has-custom-cursor");

    const cursorImages = Array.from(
      cursor.querySelectorAll<HTMLImageElement>(".cursor__img"),
    );

    gsap.set(cursor, { xPercent: 0, yPercent: 0 });

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.18,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.18,
      ease: "power3.out",
    });

    let lastMouseX = 0;
    let lastMouseY = 0;
    let activeState: CursorState | null = null;

    const applyCursorState = (nextState: CursorState = "default") => {
      if (activeState === nextState) return;
      activeState = nextState;
      setState(nextState);

      cursorImages.forEach((img) => {
        img.classList.toggle(
          "is-active",
          img.dataset.cursorState === nextState,
        );
      });
    };

    const setCursorVisible = (nextVisible: boolean) => {
      setVisible(nextVisible);
      cursor.classList.toggle("is-visible", nextVisible);
    };

    const syncCursorState = () => {
      const pointerTarget = document.elementFromPoint(lastMouseX, lastMouseY);

      if (!pointerTarget || !document.documentElement.contains(pointerTarget)) {
        setCursorVisible(false);
        return;
      }

      if (pointerTarget.closest("[data-cursor-hidden]")) {
        setCursorVisible(false);
        return;
      }

      setCursorVisible(true);

      const hoverTarget = pointerTarget.closest("[data-hover], [data-cursor]");
      if (hoverTarget) {
        const key =
          hoverTarget.getAttribute("data-cursor") ||
          hoverTarget.getAttribute("data-hover") ||
          "link";
        applyCursorState(HOVER_TO_STATE[key] ?? "pointer");
        return;
      }

      if (pointerTarget.closest(TEXT_CURSOR_SELECTOR)) {
        applyCursorState("text");
        return;
      }

      applyCursorState("default");
    };

    const onMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      xTo(lastMouseX);
      yTo(lastMouseY);
      syncCursorState();
    };

    const onStateInvalidated = () => {
      if (!cursor.classList.contains("is-visible")) return;
      requestAnimationFrame(syncCursorState);
    };

    const onMouseLeave = () => {
      lastMouseX = 0;
      lastMouseY = 0;
      setCursorVisible(false);
    };

    const onWindowBlur = () => {
      setCursorVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onStateInvalidated, { passive: true });
    window.addEventListener("resize", onStateInvalidated);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("click", onStateInvalidated);
    document.addEventListener("visibilitychange", onWindowBlur);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onStateInvalidated);
      window.removeEventListener("resize", onStateInvalidated);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("click", onStateInvalidated);
      document.removeEventListener("visibilitychange", onWindowBlur);
      document.removeEventListener("mouseleave", onMouseLeave);
      cursor.classList.remove(
        "is-visible",
        "is-pointer",
        "is-text",
        "is-default",
      );
      gsap.set(cursor, { clearProps: "all" });
    };
  }, [enabled]);

  return { cursorRef, state, visible, enabled };
}
