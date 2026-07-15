import {
  SectionEyebrow,
  SectionIntro,
} from "@/components/SectionHeader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  ["01", "Consultation", "Project goals, site, budget, and constraints."],
  ["02", "Concept", "Spatial direction, atmosphere, references, and massing."],
  [
    "03",
    "Design Development",
    "Plans, materials, lighting, and technical refinement.",
  ],
  [
    "04",
    "Technical Drawings",
    "Documentation for coordination, pricing, and permits.",
  ],
  [
    "05",
    "Execution Support",
    "Site coordination, review, and detail guidance.",
  ],
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from('[data-animate="process-step"]', {
          y: 38,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72%",
            once: true,
          },
        });

        gsap.fromTo(
          '[data-animate="process-steps"]',
          { "--process-progress": "0%" },
          {
            "--process-progress": "100%",
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="process" id="process">
      <SectionEyebrow className="process__eyebrow">
        06 — Process
      </SectionEyebrow>

      <SectionIntro className="process__intro" title="Process">
        A clear sequence keeps the work calm, legible, and controlled from first
        conversation to site execution.
      </SectionIntro>

      <div className="process__steps" data-animate="process-steps">
        {steps.map(([number, title, text]) => (
          <article
            className="process__step"
            data-animate="process-step"
            key={number}
          >
            <span className="process__number mono">{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
