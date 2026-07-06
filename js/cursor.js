function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  mm.add("(min-width: 769px)", () => {
    document.body.classList.add("has-custom-cursor");

    const cursorImages = Array.from(cursor.querySelectorAll(".cursor__img"));
    const cursorStateClasses = ["is-pointer", "is-text", "is-default"];

    const hoverToState = {
      link: "pointer",
      view: "pointer",
      project: "pointer",
      close: "pointer",
      text: "text",
    };
    const textCursorSelector = [
      ".hero-headline",
      ".hero-kicker",
      ".hero-support",
      ".manifesto-line > span:not(.manifesto-img-span)",
      ".project-item h2",
      ".project-archive-eyebrow",
      ".works-head h2",
      ".works-head p",
      ".works-head .eyebrow",
      ".loader-caption p",
      ".loader-count",
      ".footer-hero-title",
      ".footer-mark",
      ".footer-info-block p",
      ".detail-info h3",
      ".detail-desc",
    ].join(",");

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
    let activeState = null;

    const applyCursorState = (state = "default") => {
      if (activeState === state) return;
      activeState = state;

      cursor.classList.remove(...cursorStateClasses);
      cursor.classList.add(`is-${state}`);

      cursorImages.forEach((img) => {
        img.classList.toggle("is-active", img.dataset.cursorState === state);
      });
    };

    const setCursorVisible = (visible = true) => {
      cursor.classList.toggle("is-visible", visible);
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
        applyCursorState(hoverToState[key] || "pointer");
        return;
      }

      if (pointerTarget.closest(textCursorSelector)) {
        applyCursorState("text");
        return;
      }

      applyCursorState("default");
    };

    const onMouseMove = (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

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

      cursor.classList.remove("is-visible", ...cursorStateClasses);
      gsap.set(cursor, { clearProps: "all" });
    };
  });

  if (!finePointerQuery.matches) {
    cursor.classList.remove("is-visible");
  }
}
