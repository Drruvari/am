import Arrow from "@/components/Arrow";
import ProjectInvitation from "@/pages/Home/sections/06";
import Contact from "@/pages/Home/sections/07";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const images = {
  portrait: `${import.meta.env.BASE_URL}assets/images/arch.jpg`,
  architecture:
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=88",
  interior:
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=88",
  material:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=88",
  workspace:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=88",
};

const process = [
  {
    number: "01",
    label: "Listen",
    title: "Understand the place and the life it needs to hold.",
    text: "I begin with site, climate, constraints, and conversation. The brief becomes a shared foundation rather than a fixed answer.",
    image: images.material,
  },
  {
    number: "02",
    label: "Shape",
    title: "Build one clear architectural idea.",
    text: "Plans, sections, models, and materials are developed together until every move supports the central idea.",
    image: images.interior,
  },
  {
    number: "03",
    label: "Deliver",
    title: "Carry the idea through every scale.",
    text: "I stay close through documentation and construction so spatial intent survives in junctions, surfaces, and everyday use.",
    image: images.architecture,
  },
];

const principles = [
  {
    title: "Attention before expression",
    text: "I begin by understanding the place, the people, and the everyday rituals the architecture must support.",
  },
  {
    title: "Clarity through every scale",
    text: "One central idea guides plan, section, material, and detail so the finished space feels calm and coherent.",
  },
  {
    title: "Direct responsibility",
    text: "I remain personally involved from first conversation through construction, keeping decisions close and consistent.",
  },
];

export default function Studio() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-studio-reveal]");

      if (reducedMotion) {
        gsap.set(reveals, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.from(".studio-intro__line > span", {
        yPercent: 110,
        duration: 1.15,
        stagger: 0.09,
        ease: "power4.out",
        delay: 0.15,
      });

      reveals.forEach((element) => {
        gsap.from(element, {
          y: Number(element.dataset.studioDistance || 56),
          autoAlpha: 0,
          clipPath: element.dataset.studioMask
            ? "inset(0 0 100% 0)"
            : "inset(0 0 0% 0)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: element.dataset.studioStart || "top 86%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-studio-parallax]").forEach((media) => {
        const image = media.querySelector("img");
        if (!image) return;

        gsap.fromTo(
          image,
          { yPercent: -7, scale: 1.08 },
          {
            yPercent: 7,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      const marquee = gsap.fromTo(
        ".studio-strip__track",
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
        },
      );

      const settleMarquee = gsap
        .delayedCall(0.14, () => {
          gsap.to(marquee, {
            timeScale: 1,
            duration: 0.9,
            ease: "power3.out",
            overwrite: true,
          });
        })
        .pause();

      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          const acceleratedSpeed = gsap.utils.clamp(1, 5, 1 + velocity / 650);

          gsap.to(marquee, {
            timeScale: acceleratedSpeed,
            duration: 0.12,
            ease: "power2.out",
            overwrite: true,
          });
          settleMarquee.restart(true);
        },
      });

      const processSheets = gsap.utils.toArray<HTMLElement>(
        ".studio-process__step",
      );
      processSheets.slice(0, -1).forEach((sheet, index) => {
        gsap.to(sheet, {
          scale: 0.985,
          backgroundColor: "#d9d9d6",
          ease: "none",
          scrollTrigger: {
            trigger: processSheets[index + 1],
            start: "top bottom",
            end: "top top",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: pageRef },
  );

  return (
    <>
      <main ref={pageRef} id="top" className="studio-page">
        <section className="studio-intro">
          <p className="studio-eyebrow mono">Independent architecture practice</p>
          <h1>
            <span className="studio-intro__line">
              <span>Spaces, shaped</span>
            </span>
            <span className="studio-intro__line">
              <span>to be lived in.</span>
            </span>
          </h1>
          <div className="studio-intro__meta">
            <p>
              Architecture and interiors developed with care, clarity, and a
              close relationship between idea and making.
            </p>
            <span className="mono">Arbër Manga · Tirana</span>
          </div>
        </section>

        <section className="studio-strip" aria-label="Selected studio work">
          <div className="studio-strip__track">
            {[false, true].map((duplicate) => (
              <div
                className="studio-strip__set"
                key={String(duplicate)}
                aria-hidden={duplicate || undefined}
              >
                <figure>
                  <img
                    src={images.material}
                    alt={duplicate ? "" : "Concrete architectural detail"}
                  />
                </figure>
                <figure>
                  <img
                    src={images.interior}
                    alt={duplicate ? "" : "Warm minimal interior"}
                  />
                </figure>
                <figure>
                  <img
                    src={images.architecture}
                    alt={duplicate ? "" : "Contemporary house in landscape"}
                  />
                </figure>
              </div>
            ))}
          </div>
        </section>

        <section className="studio-manifesto">
          <Arrow
            side="right"
            size="clamp(2.75rem, 4vw, 5rem)"
            borderThickness={2.25}
          />
          <h2 data-studio-reveal>
            I work directly with each client, from first conversation to the
            final built detail.
          </h2>
          <div className="studio-manifesto__note" data-studio-reveal>
            <span className="studio-eyebrow mono">(Solo practice)</span>
            <p>
              One point of contact. One consistent design voice. Specialist
              engineers, makers, and consultants join only when the project
              needs them.
            </p>
          </div>
        </section>

        <section className="studio-profile">
          <header className="studio-profile__header" data-studio-reveal>
            <span className="studio-eyebrow mono">(The architect)</span>
            <h2>
              Working,
              <br />
              personally.
            </h2>
          </header>

          <div className="studio-profile__aside" data-studio-reveal>
            <p>
              One architect.
              <br />
              One direct process.
            </p>
            <span className="studio-eyebrow mono">(Principles)</span>
          </div>

          <figure
            className="studio-profile__portrait"
            data-studio-reveal
            data-studio-mask
            data-studio-parallax
          >
            <img src={images.portrait} alt="Arbër Manga" />
          </figure>

          <div className="studio-profile__principles" data-studio-reveal>
            {principles.map((principle, index) => (
              <article key={principle.title}>
                <span className="mono">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-process">
          <div className="studio-process__heading" data-studio-reveal>
            <span className="studio-eyebrow mono">(How I work)</span>
            <h2>A clear process, kept close.</h2>
          </div>

          <div className="studio-process__list">
            {process.map((step) => (
              <article
                className="studio-process__step"
                key={step.number}
              >
                <span className="studio-process__number">{step.number}</span>
                <span className="studio-eyebrow mono">{step.label}</span>
                <div>
                  <h3>{step.title}</h3>
                  <figure className="studio-process__image">
                    <img src={step.image} alt="" aria-hidden="true" />
                  </figure>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-collaboration">
          <figure data-studio-reveal data-studio-mask data-studio-parallax>
            <img src={images.workspace} alt="Architecture studio workspace" />
          </figure>
          <div data-studio-reveal>
            <span className="studio-eyebrow mono">(Collaboration)</span>
            <h2>A small practice with the right people around each project.</h2>
            <p>
              I assemble trusted structural, environmental, landscape, and
              fabrication specialists around a commission as required. The
              practice stays lean; the expertise does not.
            </p>
          </div>
        </section>

        <ProjectInvitation />
      </main>

      <Contact />
    </>
  );
}
