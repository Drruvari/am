import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    title: "Brief & Site Reading",
    description:
      "I read the site, climate, constraints, and daily rituals before drawing.",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Concept Strategy",
    description:
      "A clear spatial idea aligns ambition, budget, planning, and programme.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Spatial Design",
    description:
      "Plans, sections, daylight, and movement shape the character of each room.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Technical Resolution",
    description:
      "Materials, details, and consultant input turn the concept into buildable information.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Delivery & Site Review",
    description:
      "Site reviews and direct coordination protect the design through construction.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
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
    <section ref={sectionRef} className="process" id="process">
      <div className="process__intro">
        <div className="process__topline">
          <span className="mono">(Services)</span>
          <p>From first site reading to construction and final review.</p>
          <a href="#contact" data-hover="link">
            Start a project
          </a>
        </div>

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
                    {service.title}
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
