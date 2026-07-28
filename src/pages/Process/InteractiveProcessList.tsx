import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const stages = [
  {
    number: "01",
    title: "Discovery & Site",
    phase: "Listen",
    services: "Brief, site, climate, constraints, opportunities",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "02",
    title: "Sketch Design",
    phase: "Explore",
    services: "Orientation, scale, spatial flow, early cost alignment",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "03",
    title: "Design Development",
    phase: "Resolve",
    services: "Plans, sections, materials, interiors, key details",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "04",
    title: "Planning & Approvals",
    phase: "Coordinate",
    services: "Specialist advice, submissions, approvals",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "05",
    title: "Technical Documentation",
    phase: "Detail",
    services: "Drawings, schedules, pricing and construction information",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "06",
    title: "Construction Review",
    phase: "Deliver",
    services: "Site questions, key reviews, continuity of design intent",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function InteractiveProcessList() {
  const listRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const images = imageRefs.current.filter(Boolean);
    gsap.set(images, {
      autoAlpha: 0,
      clipPath: "inset(50% round 1rem)",
    });

    return () => {
      gsap.killTweensOf([highlightRef.current, previewRef.current, ...images]);
    };
  }, []);

  const showStage = (row: HTMLButtonElement, index: number) => {
    const list = listRef.current;
    const highlight = highlightRef.current;
    const preview = previewRef.current;
    if (!list || !highlight || !preview) return;

    setActiveIndex(index);

    gsap.to(highlight, {
      y: row.offsetTop,
      height: row.offsetHeight,
      autoAlpha: 1,
      duration: 0.42,
      ease: "power3.out",
    });

    imageRefs.current.forEach((image, imageIndex) => {
      if (!image) return;
      gsap.killTweensOf(image);
      gsap.to(image, {
        autoAlpha: imageIndex === index ? 1 : 0,
        clipPath:
          imageIndex === index
            ? "inset(0% round 1rem)"
            : "inset(50% round 1rem)",
        duration: imageIndex === index ? 0.55 : 0.2,
        ease: "power3.out",
      });
    });
  };

  const hideStages = () => {
    setActiveIndex(null);
    gsap.to(highlightRef.current, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(imageRefs.current.filter(Boolean), {
      autoAlpha: 0,
      clipPath: "inset(50% round 1rem)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const movePreview = (event: React.PointerEvent<HTMLDivElement>) => {
    const preview = previewRef.current;
    if (!preview || activeIndex === null) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(preview, {
      x: x * 36,
      y: y * 24,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <section className="process-list" aria-labelledby="process-list-title">
      <div className="process-list__heading">
        <span className="mono">(Overview)</span>
        <h2 id="process-list-title">Six stages. One continuous line of thought.</h2>
        <p>Move through the stages to see how each step builds on the last.</p>
      </div>

      <div
        className="process-list__interactive"
        onPointerMove={movePreview}
        onPointerLeave={hideStages}
      >
        <div ref={previewRef} className="process-list__preview" aria-hidden="true">
          {stages.map((stage, index) => (
            <img
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              src={stage.image}
              alt=""
              key={stage.title}
            />
          ))}
        </div>

        <div ref={listRef} className="process-list__rows">
          <div
            ref={highlightRef}
            className="process-list__highlight"
            aria-hidden="true"
          />
          {stages.map((stage, index) => (
            <button
              type="button"
              className={activeIndex === index ? "is-active" : undefined}
              onPointerEnter={(event) => showStage(event.currentTarget, index)}
              onFocus={(event) => showStage(event.currentTarget, index)}
              onBlur={hideStages}
              key={stage.number}
            >
              <span className="mono">({stage.number})</span>
              <strong>{stage.title}</strong>
              <span>{stage.phase}</span>
              <span>{stage.services}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
