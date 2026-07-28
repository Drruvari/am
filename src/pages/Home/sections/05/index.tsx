import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    title: "Discovery & Site",
    description:
      "I begin with a conversation and site visit to understand practical needs, ambitions, climate, constraints, and opportunities.",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Sketch Design",
    description:
      "Hand sketches test orientation, scale, movement, and atmosphere until one clear architectural direction emerges.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Design Development",
    description:
      "Plans, sections, materials, interiors, and key details develop together into a coherent proposal you can understand.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Planning & Approvals",
    description:
      "Where approvals are required, I coordinate specialist advice and prepare the architectural information needed for submission.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Technical Documentation",
    description:
      "The approved design becomes a precise set of drawings, schedules, and details ready for pricing and construction.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Construction Review",
    description:
      "I remain involved during the build, answering questions and reviewing key work so the original intent carries through.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);

  const selectService = (index: number) => {
    if (index === activeService) return;
    setActiveService(index);
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          scrollTrigger: {
            trigger: ".process__intro-grid",
            start: "top 78%",
            once: true,
          },
        })
        .from(".process__topline > *", {
          y: 16,
          autoAlpha: 0,
          stagger: 0.06,
        })
        .from(
          ".process__statement",
          { y: 36, autoAlpha: 0 },
          "-=0.4",
        )
        .from(
          ".process__preview > *",
          { y: 28, autoAlpha: 0, stagger: 0.08 },
          "-=0.45",
        )
        .from(
          ".process__services li",
          { y: 24, autoAlpha: 0, stagger: 0.06 },
          "-=0.55",
        );

    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="process"
      id="process"
      data-header-theme="light"
    >
      <div className="process__intro">
        <div className="process__topline">
          <span className="mono">(Process)</span>
          <p>Six stages, one direct line from first conversation to built space.</p>
          <a href="#contact" data-hover="link">
            Start a project
          </a>
        </div>

        <h2 className="process__statement">
          Good architecture grows from clear decisions, honest dialogue, and
          continuity from sketch to site.
        </h2>

        <div className="process__intro-grid">
          <div
            className={`process__preview process__preview--${activeService}`}
          >
            <figure className="process__intro-media">
              {services.map((service, index) => (
                <img
                  className={index === activeService ? "is-active" : undefined}
                  src={service.image}
                  alt={index === activeService ? service.title : ""}
                  aria-hidden={index !== activeService}
                  key={service.title}
                />
              ))}
            </figure>
            <p className="process__preview-copy" key={activeService}>
              {services[activeService].description}
            </p>
          </div>

          <div className="process__services">
            <ul>
              {services.map((service, index) => (
                <li
                  className={index === activeService ? "is-active" : undefined}
                  key={service.title}
                >
                  <button
                    type="button"
                    onMouseEnter={() => selectService(index)}
                    onFocus={() => selectService(index)}
                    onClick={() => selectService(index)}
                    aria-pressed={index === activeService}
                  >
                    <span className="mono">
                      ({String(index + 1).padStart(2, "0")})
                    </span>
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
