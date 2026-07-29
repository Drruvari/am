import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";

const SCROLL_PER_PX = 1;
const LERP_FACTOR = 0.06;
const DRAG_LERP_FACTOR = 0.18;
const MOTION_LERP_FACTOR = 0.08;
const MOMENTUM_FRICTION = 0.9;
const MIN_MOMENTUM = 0.1;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;

export interface ZoomSliderItem {
  number: string;
  src: string;
  title: string;
  desc: string;
  categories: WorkCategory[];
}

export type WorkCategory =
  | "Homes"
  | "Interior Design"
  | "Renovations"
  | "Commercial";

type WorkFilter = "All Projects" | WorkCategory;

const FILTERS: WorkFilter[] = [
  "All Projects",
  "Homes",
  "Interior Design",
  "Renovations",
  "Commercial",
];

interface ZoomSliderCompProps {
  sliderData: ZoomSliderItem[];
  title?: string;
}

interface SliderState {
  current: number;
  target: number;
  raf: number;
  isDragging: boolean;
  lastX: number;
  lastY: number;
  velocity: number;
  visualMotion: number;
}

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

export default function ZoomSliderComp({
  sliderData,
  title,
}: ZoomSliderCompProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const imageWrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const previousFilterRef = useRef<WorkFilter>("All Projects");
  const stateRef = useRef<SliderState>({
    current: 0,
    target: 0,
    raf: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    velocity: 0,
    visualMotion: 0,
  });
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("All Projects");
  const filteredImages = useMemo(
    () =>
      activeFilter === "All Projects"
        ? sliderData
        : sliderData.filter((item) => item.categories.includes(activeFilter)),
    [activeFilter, sliderData],
  );

  const isMobile = viewport.width < MOBILE_BREAKPOINT;
  const isTablet =
    viewport.width >= MOBILE_BREAKPOINT && viewport.width < TABLET_BREAKPOINT;
  const cardWidth = isMobile
    ? Math.round(viewport.width * 0.82)
    : isTablet
      ? Math.round(viewport.width * 0.42)
      : Math.round(Math.min(420, Math.max(300, viewport.width * 0.2)));
  const cardHeight = isMobile
    ? Math.round(Math.min(viewport.height * 0.52, cardWidth * 1.25))
    : Math.round(Math.min(viewport.height * 0.56, cardWidth * 1.32));
  const cardGap = isMobile ? 8 : isTablet ? 12 : 16;
  const cardStep = cardWidth + cardGap;
  const images = useMemo(() => {
    if (!filteredImages.length) return [];

    const minimumCount = Math.ceil(viewport.width / cardStep) + 2;
    return Array.from(
      { length: Math.max(filteredImages.length, minimumCount) },
      (_, index) => filteredImages[index % filteredImages.length],
    );
  }, [cardStep, filteredImages, viewport.width]);

  useEffect(() => {
    const updateViewport = () =>
      setViewport((current) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        return current.width === width && current.height === height
          ? current
          : { width, height };
      });

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  const positionCards = useCallback(
    (offset: number, motion = 0) => {
      const count = images.length;
      if (!rootRef.current || !stripRef.current || !count) return;

      const loopWidth = count * cardStep;
      const normalizedOffset = ((offset % loopWidth) + loopWidth) % loopWidth;
      const startIndex = Math.floor(normalizedOffset / cardStep);
      const fractionalOffset = (normalizedOffset % cardStep) / cardStep;
      const contentHeight = cardHeight + (isMobile ? 104 : 122);
      const top = Math.max(
        isMobile ? 142 : 102,
        Math.round((window.innerHeight - contentHeight) / 2),
      );
      const tilt = reduceMotion || isMobile ? 0 : motion * 1.2;
      const lift = reduceMotion || isMobile ? 0 : -Math.abs(motion) * 8;

      for (let index = 0; index < count; index += 1) {
        const cardIndex = (startIndex + index) % count;
        const x = (index - fractionalOffset - 1) * cardStep;
        const card = cardRefs.current[cardIndex];
        const imageWrap = imageWrapRefs.current[cardIndex];
        const caption = captionRefs.current[cardIndex];

        if (!card || !imageWrap || !caption) continue;
        card.style.transform = `translate3d(${x}px, ${top + lift}px, 0) rotate(${tilt}deg)`;
        imageWrap.style.width = `${cardWidth}px`;
        imageWrap.style.height = `${cardHeight}px`;
        caption.style.width = `${cardWidth}px`;
        caption.style.transform = "none";
      }
    },
    [
      cardHeight,
      cardStep,
      cardWidth,
      isMobile,
      images.length,
      reduceMotion,
    ],
  );

  useEffect(() => {
    if (!images.length) return;

    const state = stateRef.current;
    const root = rootRef.current;
    if (!root) return;
    const loopWidth = images.length * cardStep;

    const tick = () => {
      if (
        !reduceMotion &&
        !state.isDragging &&
        Math.abs(state.velocity) > MIN_MOMENTUM
      ) {
        state.target += state.velocity;
        state.velocity *= MOMENTUM_FRICTION;
      } else if (!state.isDragging) {
        state.velocity = 0;
      }

      state.current = lerp(
        state.current,
        state.target,
        reduceMotion
          ? 1
          : state.isDragging
            ? isMobile
              ? 0.32
              : DRAG_LERP_FACTOR
            : isMobile
              ? 0.12
              : LERP_FACTOR,
      );

      if (Math.abs(state.current - state.target) < 0.01) {
        const shift = Math.trunc(state.current / loopWidth) * loopWidth;
        state.current -= shift;
        state.target -= shift;
      }

      const targetMotion = Math.max(
        -1,
        Math.min(1, (state.target - state.current) / cardStep),
      );
      state.visualMotion = lerp(
        state.visualMotion,
        targetMotion,
        reduceMotion ? 1 : MOTION_LERP_FACTOR,
      );
      positionCards(state.current, state.visualMotion);
      state.raf = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta =
        Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 90);
      state.target += delta * SCROLL_PER_PX;
    };
    const beginDrag = (clientX: number, clientY: number) => {
      state.isDragging = true;
      state.lastX = clientX;
      state.lastY = clientY;
      state.velocity = 0;
    };
    const moveDrag = (clientX: number, clientY: number, direction = 1) => {
      if (!state.isDragging) return;
      const deltaX = clientX - state.lastX;
      const deltaY = clientY - state.lastY;
      const delta =
        (Math.abs(deltaX) >= Math.abs(deltaY) ? -deltaX : -deltaY) * direction;

      state.target += delta;
      state.velocity = lerp(state.velocity, delta, 0.5);
      state.lastX = clientX;
      state.lastY = clientY;
    };
    const endDrag = () => {
      state.isDragging = false;
    };
    const isFilterInteraction = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest(".zoom-slider__filters"));
    const onMouseDown = (event: MouseEvent) => {
      if (isFilterInteraction(event.target)) return;
      beginDrag(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) =>
      moveDrag(event.clientX, event.clientY);
    const onTouchStart = (event: TouchEvent) => {
      if (isFilterInteraction(event.target)) return;
      beginDrag(event.touches[0].clientX, event.touches[0].clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!state.isDragging) return;
      const deltaX = event.touches[0].clientX - state.lastX;
      const deltaY = event.touches[0].clientY - state.lastY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        endDrag();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      moveDrag(event.touches[0].clientX, state.lastY);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);
    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      root.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endDrag);
      window.removeEventListener("touchcancel", endDrag);
    };
  }, [cardStep, images.length, isMobile, positionCards, reduceMotion]);

  useEffect(() => {
    if (previousFilterRef.current === activeFilter) return;
    previousFilterRef.current = activeFilter;

    const state = stateRef.current;
    state.current = 0;
    state.target = 0;
    state.velocity = 0;
    state.visualMotion = 0;
    state.isDragging = false;
    positionCards(0);

    if (reduceMotion) return;

    const cards = cardRefs.current.slice(0, images.length);
    const imageWraps = imageWrapRefs.current.slice(0, images.length);
    const captions = captionRefs.current.slice(0, images.length);

    gsap.killTweensOf([...cards, ...imageWraps, ...captions]);
    const timeline = gsap
      .timeline()
      .fromTo(
        cards,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.035,
          ease: "power2.out",
        },
      )
      .fromTo(
        imageWraps,
        { clipPath: "inset(0 0 18% 0)", y: 18 },
        {
          clipPath: "inset(0% 0 0% 0)",
          y: 0,
          duration: 0.7,
          stagger: 0.035,
          ease: "power3.out",
        },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [activeFilter]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.65 });

      timeline
        .fromTo(
          ".zoom-slider__heading",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.8,
            ease: "power4.out",
          },
        )
        .fromTo(
          imageWrapRefs.current.slice(0, images.length),
          { clipPath: "inset(100% 0 0 0)", y: 35 },
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 1.15,
            stagger: 0.045,
            ease: "power4.inOut",
          },
          0.05,
        )
        .fromTo(
          captionRefs.current.slice(0, images.length),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.035,
            ease: "power3.out",
          },
          0.5,
        )
        .fromTo(
          ".zoom-slider__status",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.75,
            ease: "power3.out",
          },
          0.55,
        );
    }, root);

    return () => context.revert();
  }, [reduceMotion, title]);

  return (
    <section
      ref={rootRef}
      className={`zoom-slider${title && title.length > 8 ? " zoom-slider--long-title" : ""}`}
      aria-label={title ?? "Works"}
    >
      <aside className="zoom-slider__filters" aria-label="Filter projects">
        <p className="zoom-slider__filter-label">
          (Filter projects) {filteredImages.length}
        </p>
        <div className="zoom-slider__filter-list">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "is-active" : undefined}
              aria-pressed={activeFilter === filter}
              data-hover="link"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </aside>

      <div className="zoom-slider__bottom">
        <div className="zoom-slider__heading">
          <h1>{title}</h1>
        </div>

        <div className="zoom-slider__status" aria-hidden="true">
          <p>Scroll down to explore</p>
        </div>
      </div>

      <div ref={stripRef} className="zoom-slider__strip">
        {images.map((item, index) => (
          <article
            key={`${item.number}-${item.title}-${index}`}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="zoom-slider__card"
          >
            <div
              ref={(element) => {
                imageWrapRefs.current[index] = element;
              }}
              className="zoom-slider__image"
              data-hover="view"
              style={{ width: cardWidth, height: cardHeight }}
            >
              <img src={item.src} alt={item.title} draggable={false} />
            </div>
            <div
              ref={(element) => {
                captionRefs.current[index] = element;
              }}
              className="zoom-slider__caption"
            >
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <ul aria-label={`${item.title} categories`}>
                {item.categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
