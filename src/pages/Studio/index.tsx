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
  portrait: `${import.meta.env.BASE_URL}assets/images/arch.webp`,
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

      gsap
        .timeline({ delay: 0.15 })
        .from(".studio-intro__line > span", {
          yPercent: 110,
          duration: 1.15,
          stagger: 0.09,
          ease: "power4.out",
        })
        .from(
          ".studio-intro__line--with-image",
          {
            columnGap: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          ">-0.08",
        )
        .from(
          ".studio-intro__line--with-image figure",
          {
            width: 0,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "<",
        );

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

      gsap.utils
        .toArray<HTMLElement>("[data-studio-parallax]")
        .forEach((media) => {
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

      if (window.matchMedia("(min-width: 769px)").matches) {
        const finalProcessSheet = pageRef.current?.querySelector<HTMLElement>(
          ".studio-process__step:nth-child(3)",
        );
        const finalProcessNumber =
          finalProcessSheet?.querySelector<HTMLElement>(
            ".studio-process__number",
          );

        if (finalProcessSheet && finalProcessNumber) {
          const getStickyTop = () =>
            Number.parseFloat(
              window.getComputedStyle(finalProcessSheet).top,
            ) || 0;

          const getNumberTravel = () => {
            const styles = window.getComputedStyle(finalProcessSheet);
            const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
            const fontSize =
              Number.parseFloat(
                window.getComputedStyle(finalProcessNumber).fontSize,
              ) || finalProcessNumber.offsetHeight;
            const available =
              finalProcessSheet.clientHeight -
              finalProcessNumber.offsetTop -
              fontSize -
              paddingBottom;

            return Math.max(0, available * 0.55);
          };

          gsap.fromTo(
            finalProcessNumber,
            { y: 0 },
            {
              y: () => getNumberTravel(),
              ease: "none",
              scrollTrigger: {
                trigger: finalProcessSheet,
                start: () => `top ${getStickyTop()}px`,
                end: () => `+=${Math.round(window.innerHeight * 0.4)}`,
                scrub: 0.35,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      }

    },
    { scope: pageRef },
  );

  return (
    <>
      <main
        ref={pageRef}
        id="top"
        className="studio-page"
        data-header-theme="light"
      >
        <section className="studio-intro">
          <h1>
            <span className="studio-intro__line studio-intro__line--with-image">
              <figure>
                <img src={images.architecture} alt="" aria-hidden="true" />
              </figure>
              <span>Architecture</span>
            </span>
            <span className="studio-intro__line">
              <span>for everyday</span>
            </span>
            <span className="studio-intro__line">
              <span>life.</span>
            </span>
          </h1>
          <div className="studio-intro__meta">
            <p>
              A solo architecture practice, shaping places with care from first
              idea to final detail.
            </p>
            <span className="mono">[Scroll]</span>
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
            Good architecture grows through trust, careful listening, and a
            shared understanding of what a place should become.
          </h2>
          <div className="studio-manifesto__note" data-studio-reveal>
            <span className="studio-eyebrow mono">(Solo practice)</span>
            <p>
              I keep the practice intentionally small so ideas, decisions, and
              responsibilities stay close from the first sketch through the
              completed space.
            </p>
          </div>
        </section>

        <section className="studio-profile">
          <header className="studio-profile__header" data-studio-reveal>
            <h2>
              Architecture becomes meaningful when it responds clearly to
              place, daily life, and the people it serves.
            </h2>
          </header>

          <div className="studio-profile__aside" data-studio-reveal>
            <span className="studio-eyebrow mono">(The architect)</span>
            <p>
              I work directly with each client, keeping design thinking,
              communication, and responsibility connected from the first
              conversation to the completed space.
            </p>
          </div>

          <div className="studio-profile__media">
            <figure
              data-studio-reveal
              data-studio-mask
              data-studio-parallax
            >
              <img src={images.portrait} alt="Arbër Manga" />
            </figure>
            <figure
              data-studio-reveal
              data-studio-mask
              data-studio-parallax
            >
              <img src={images.material} alt="Architectural material detail" />
            </figure>
          </div>

        </section>

        <section className="studio-process">
          <div className="studio-process__heading" data-studio-reveal>
            <span className="studio-eyebrow mono">(How I work)</span>
            <h2>From first questions to a resolved place.</h2>
          </div>

          <div className="studio-process__list">
            {process.map((step) => (
              <article className="studio-process__step" key={step.number}>
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
            <h2>Independent in direction, collaborative where it matters.</h2>
            <p>
              Each commission is led by me and supported by trusted engineers,
              landscape designers, makers, and consultants selected for its
              particular needs. The structure stays direct while the knowledge
              around the project expands.
            </p>
          </div>
        </section>

        <ProjectInvitation />
      </main>

      <Contact />
    </>
  );
}
