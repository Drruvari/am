import arrow from "@/assets/arrow.svg";
import ColorBends from "@/components/ColorBends";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const invitationColors = ["#d1d1c7", "#6b645c", "#b97e56"] as const;

export default function ProjectInvitation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=75%",
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
            },
          })
          .fromTo(
            ".project-invitation__media",
            {
              scale: 1.22,
              clipPath: "inset(0 0% round 0 0 24px 24px)",
            },
            {
              scale: 1.02,
              clipPath: "inset(0 2.2% round 0 0 24px 24px)",
              duration: 1,
            },
            0,
          )
          .fromTo(
            ".project-invitation__headline-last",
            { xPercent: 0 },
            { xPercent: 18, duration: 1 },
            0,
          );
      });

      media.add("(max-width: 768px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          })
          .fromTo(
            ".project-invitation__media",
            {
              scale: 1.16,
              clipPath: "inset(0 0% round 0 0 16px 16px)",
            },
            {
              scale: 1.02,
              clipPath: "inset(0 3.5% round 0 0 16px 16px)",
              duration: 1,
            },
            0,
          )
          .fromTo(
            ".project-invitation__headline-last",
            { xPercent: 0 },
            { xPercent: 7, duration: 1 },
            0,
          );
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="project-invitation"
      aria-labelledby="project-invitation-title"
    >
      <div className="project-invitation__media" aria-hidden="true">
        <ColorBends
          colors={invitationColors}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={0.85}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>
      <div className="project-invitation__shade" aria-hidden="true" />

      <div className="project-invitation__content">
        <p className="project-invitation__eyebrow mono" data-reveal="fade">
          (Start a conversation)
        </p>
        <h2 id="project-invitation-title">
          <span data-reveal="up">Let’s shape places</span>
          <span data-reveal="up">that feel lived in</span>
          <span className="project-invitation__headline-last">
            <img src={arrow} alt="" aria-hidden="true" />
            <span className="project-invitation__headline-last-text">
              from day one.
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
