import Arrow from "@/components/Arrow";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.scss";

type GalleryItem = {
  title: string;
  meta: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

const items: GalleryItem[] = [
  { title: "House on the Ridge", meta: "Residence · 2025", src: asset("images/arch.webp"), x: 470, y: 330, width: 1020, height: 560 },
  { title: "Coastal Study", meta: "Process · 2024", src: asset("images/gallery-concrete-01.webp"), x: 1710, y: 90, width: 370, height: 500 },
  { title: "Material Assembly", meta: "Detail · 2025", src: asset("images/gallery-concrete-02.webp"), x: 1560, y: 760, width: 500, height: 340 },
  { title: "Courtyard Rooms", meta: "Residence · 2023", src: asset("images/gallery-concrete-03.webp"), x: 70, y: 1100, width: 500, height: 460 },
  { title: "Drafting Study", meta: "Drawing · 2025", src: asset("images/gallery-concrete-03.webp"), x: 720, y: 1190, width: 380, height: 430 },
  { title: "Model Study", meta: "Model · 2024", src: asset("images/gallery-concrete-04.webp"), x: 1310, y: 1320, width: 650, height: 370 },
  { title: "Threshold", meta: "Interior · 2025", src: asset("images/arch.webp"), x: -180, y: 180, width: 380, height: 500 },
  { title: "Living Framework", meta: "Research · 2024", src: asset("images/gallery-concrete-02.webp"), x: 70, y: 790, width: 280, height: 200 },
  { title: "Light Court", meta: "Residence · 2025", src: asset("images/gallery-concrete-02.webp"), x: 1210, y: -150, width: 390, height: 280 },
  { title: "Civic Frame", meta: "Archive · 2023", src: asset("images/gallery-concrete-04.webp"), x: 650, y: 30, width: 350, height: 220 },
  { title: "Concrete Rhythm", meta: "Facade · 2024", src: asset("images/gallery-concrete-01.webp"), x: 2050, y: 1020, width: 300, height: 410 },
  { title: "Garden Threshold", meta: "Interior · 2024", src: "https://images.unsplash.com/photo-1633557018921-39299488e1c9?auto=format&fit=crop&q=68&w=1000", x: 1050, y: 980, width: 250, height: 350 },
  { title: "Museum Passage", meta: "Civic · 2025", src: "https://images.unsplash.com/photo-1761287347579-a9f73da0f959?auto=format&fit=crop&q=68&w=1000", x: 1030, y: 40, width: 300, height: 200 },
  { title: "Circular Court", meta: "Interior · 2023", src: "https://images.unsplash.com/photo-1544840132-e882f4b414c2?auto=format&fit=crop&q=68&w=1000", x: 1790, y: 630, width: 280, height: 210 },
  { title: "Window Room", meta: "Interior · 2024", src: "https://images.unsplash.com/photo-1719603235487-1ae56fc89535?auto=format&fit=crop&q=68&w=1000", x: 360, y: 1600, width: 420, height: 220 },
  { title: "Old Mill", meta: "Adaptive reuse · 2025", src: "https://images.unsplash.com/photo-1741524916134-48f00f42d925?auto=format&fit=crop&q=68&w=1000", x: -70, y: 1510, width: 340, height: 250 },
];

const repetitions = [-1, 0] as const;
const grid = { width: 2200, height: 1800 };

function GalleryMedia({ item, eager = false }: { item: GalleryItem; eager?: boolean }) {
  return (
    <img
      src={item.src}
      alt=""
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

export default function Gallery() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const focusBackdropRef = useRef<HTMLButtonElement>(null);
  const focusFigureRef = useRef<HTMLElement>(null);
  const focusOriginRef = useRef<DOMRect | null>(null);
  const focusClosingRef = useRef(false);
  const position = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    scale: 1,
  });
  const pointer = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
    suppressUntil: 0,
  });
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const closeFocus = () => {
    if (focusClosingRef.current) return;
    const figure = focusFigureRef.current;
    const backdrop = focusBackdropRef.current;
    const origin = focusOriginRef.current;

    if (!figure || !backdrop || !origin) {
      setActiveItem(null);
      return;
    }

    focusClosingRef.current = true;
    const finalRect = figure.getBoundingClientRect();
    gsap
      .timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          focusClosingRef.current = false;
          setActiveItem(null);
        },
      })
      .to(
        backdrop,
        { opacity: 0, duration: 0.55, ease: "power2.inOut" },
        0,
      )
      .to(
        figure,
        {
          x: origin.left - finalRect.left,
          y: origin.top - finalRect.top,
          scaleX: origin.width / finalRect.width,
          scaleY: origin.height / finalRect.height,
          duration: 0.8,
          transformOrigin: "top left",
        },
        0,
      );
  };

  useLayoutEffect(() => {
    if (!activeItem) return;
    const figure = focusFigureRef.current;
    const backdrop = focusBackdropRef.current;
    const origin = focusOriginRef.current;
    if (!figure || !backdrop || !origin) return;

    const finalRect = figure.getBoundingClientRect();
    const timeline = gsap.timeline({ defaults: { ease: "expo.inOut" } });
    timeline
      .fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.65, ease: "power2.inOut" },
        0,
      )
      .fromTo(
        figure,
        {
          x: origin.left - finalRect.left,
          y: origin.top - finalRect.top,
          scaleX: origin.width / finalRect.width,
          scaleY: origin.height / finalRect.height,
          transformOrigin: "top left",
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.9,
          clearProps: "transform",
        },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [activeItem]);

  useEffect(() => {
    document.body.classList.add("is-gallery-page");

    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;

    const motion = position.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let introFrame = 0;
    let introTween: gsap.core.Tween | null = null;

    const setScale = () => {
      motion.scale = Math.min(1, Math.max(0.58, window.innerWidth / 1440));
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    const render = () => {
      if (reducedMotion) {
        motion.currentX = motion.targetX;
        motion.currentY = motion.targetY;
      } else {
        motion.velocityX =
          (motion.velocityX + (motion.targetX - motion.currentX) * 0.035) *
          0.7;
        motion.velocityY =
          (motion.velocityY + (motion.targetY - motion.currentY) * 0.035) *
          0.7;
        motion.currentX += motion.velocityX;
        motion.currentY += motion.velocityY;
      }
      const wrapX = grid.width * motion.scale;
      const wrapY = grid.height * motion.scale;
      if (motion.currentX >= wrapX) {
        motion.currentX -= wrapX;
        motion.targetX -= wrapX;
      } else if (motion.currentX < 0) {
        motion.currentX += wrapX;
        motion.targetX += wrapX;
      }
      if (motion.currentY >= wrapY) {
        motion.currentY -= wrapY;
        motion.targetY -= wrapY;
      } else if (motion.currentY < 0) {
        motion.currentY += wrapY;
        motion.targetY += wrapY;
      }
      canvas.style.transform = `translate3d(${motion.currentX}px, ${motion.currentY}px, 0) scale(${motion.scale})`;

      const unsettled =
        pointer.current.active ||
        Math.abs(motion.targetX - motion.currentX) > 0.05 ||
        Math.abs(motion.targetY - motion.currentY) > 0.05 ||
        Math.abs(motion.velocityX) > 0.03 ||
        Math.abs(motion.velocityY) > 0.03;
      frame = unsettled ? window.requestAnimationFrame(render) : 0;
    };

    const startRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const horizontalDelta = event.deltaX || event.deltaY * 0.42;
      motion.targetX -= horizontalDelta * 0.4;
      motion.targetY -= event.deltaY * 0.44;
      startRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.current.active) return;
      const deltaX = event.clientX - pointer.current.x;
      const deltaY = event.clientY - pointer.current.y;
      const now = performance.now();
      const elapsed = Math.max(16, now - pointer.current.lastTime);
      if (
        Math.hypot(
          event.clientX - pointer.current.startX,
          event.clientY - pointer.current.startY,
        ) > 7
      ) {
        pointer.current.moved = true;
      }
      motion.targetX += deltaX;
      motion.targetY += deltaY;
      pointer.current.velocityX = deltaX / elapsed;
      pointer.current.velocityY = deltaY / elapsed;
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.lastTime = now;
      startRender();
    };

    const onPointerUp = () => {
      if (pointer.current.moved) {
        pointer.current.suppressUntil = performance.now() + 350;
        motion.targetX += pointer.current.velocityX * 72;
        motion.targetY += pointer.current.velocityY * 72;
      }
      pointer.current.active = false;
      field.classList.remove("is-dragging");
      document.body.classList.remove("is-gallery-dragging");
      startRender();
    };

    field.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", setScale);
    setScale();
    startRender();
    introFrame = window.requestAnimationFrame(() => {
      const visibleTiles = Array.from(
        canvas.querySelectorAll<HTMLElement>(
          ".gallery-tile:not(.gallery-tile--primary)",
        ),
      ).filter((tile) => {
        const rect = tile.getBoundingClientRect();
        return (
          rect.x > -rect.width &&
          rect.x < window.innerWidth + rect.width &&
          rect.y > -rect.height &&
          rect.y < window.innerHeight + rect.height
        );
      });

      if (!visibleTiles.length || reducedMotion) return;

      visibleTiles.forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        gsap.set(tile, {
          x:
            (-rect.x + window.innerWidth * 0.5 - rect.width * 0.5) /
            motion.scale,
          y:
            (-rect.y + window.innerHeight * 0.5 - rect.height * 0.5) /
            motion.scale,
        });
      });

      introTween = gsap.to(visibleTiles.reverse(), {
        duration: 1.2,
        ease: "power4.inOut",
        x: 0,
        y: 0,
        stagger: 0.035,
        clearProps: "transform",
      });
    });

    return () => {
      document.body.classList.remove("is-gallery-page");
      document.body.classList.remove("is-gallery-dragging");
      field.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", setScale);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(introFrame);
      introTween?.kill();
      gsap.set(canvas.querySelectorAll(".gallery-tile"), {
        clearProps: "transform",
      });
    };
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFocus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [activeItem]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeItem) return;
    pointer.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      velocityX: 0,
      velocityY: 0,
      lastTime: performance.now(),
      suppressUntil: pointer.current.suppressUntil,
    };
    fieldRef.current?.classList.add("is-dragging");
    document.body.classList.add("is-gallery-dragging");
  };

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <a className="gallery-back" href={import.meta.env.BASE_URL}>
          <Arrow side="left" size="0.9rem" borderThickness={1.35} />
          <span>Back to home</span>
        </a>
        <p className="gallery-header__brand">Arbër Manga</p>
        <p className="gallery-header__meta">Selected architecture / 2022–2026</p>
      </header>

      <div
        className="gallery-field"
        ref={fieldRef}
        onPointerDown={startDrag}
        onDragStart={(event) => event.preventDefault()}
        aria-label="Draggable architecture gallery"
      >
        <div className="gallery-canvas" ref={canvasRef}>
          {repetitions.flatMap((row) =>
            repetitions.flatMap((column) =>
              items.map((item, index) => (
                <button
                  className={`gallery-tile${
                    index === 0 ? " gallery-tile--primary" : ""
                  }`}
                  type="button"
                  key={`${row}-${column}-${item.title}`}
                  style={{
                    left: item.x + column * grid.width,
                    top: item.y + row * grid.height,
                    width: item.width,
                    height: item.height,
                  }}
                  onClick={(event) => {
                    if (
                      !pointer.current.moved &&
                      performance.now() >= pointer.current.suppressUntil
                    ) {
                      focusOriginRef.current =
                        event.currentTarget.getBoundingClientRect();
                      setActiveItem(item);
                    }
                  }}
                  aria-label={`View ${item.title}`}
                >
                  <GalleryMedia item={item} eager={row === 0 && column === 0 && index < 3} />
                  <span className="gallery-tile__caption">
                    <span>{item.title}</span>
                    <small>{item.meta}</small>
                  </span>
                </button>
              )),
            ),
          )}
        </div>
      </div>

      <footer className="gallery-footer">
        <p>Click + hold to drag and explore</p>
        <p>Scroll in any direction</p>
      </footer>

      {activeItem && (
        <div className="gallery-focus" role="dialog" aria-modal="true" aria-label={activeItem.title}>
          <button
            ref={focusBackdropRef}
            className="gallery-focus__backdrop"
            type="button"
            onClick={closeFocus}
            aria-label="Close project"
          />
          <figure ref={focusFigureRef}>
            <GalleryMedia item={activeItem} eager />
            <figcaption>
              <span>{activeItem.title}</span>
              <small>{activeItem.meta}</small>
            </figcaption>
          </figure>
          <button className="gallery-focus__close" type="button" onClick={closeFocus}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      <div className="gallery-vignette" aria-hidden="true" />
    </main>
  );
}
