import arrow from "@/assets/arrow.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    title: "Brief & Site Reading",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  },
  {
    title: "Concept Strategy",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  },
  {
    title: "Spatial Design",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  },
  {
    title: "Technical Resolution",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
  },
  {
    title: "Delivery & Site Review",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  },
];

const faqs = [
  {
    question: "Who will I work with throughout the project?",
    answer:
      "You work directly with Arbër from the first conversation through design reviews, coordination, and site decisions.",
  },
  {
    question: "How long does an architecture project usually take?",
    answer:
      "Timing depends on scale, approvals, and construction complexity. A clear programme is established after the initial brief and site review.",
  },
  {
    question: "What do you need before starting?",
    answer:
      "A site or potential site, an honest outline of your needs, an approximate budget, and any existing surveys or planning information are enough to begin.",
  },
  {
    question: "Can you coordinate consultants and approvals?",
    answer:
      "Yes. Structural, services, planning, cost, and specialist input can be coordinated as part of one joined-up design process.",
  },
  {
    question: "Do you stay involved during construction?",
    answer:
      "Yes. Site reviews, detail clarification, material decisions, and contractor coordination help protect the design through delivery.",
  },
  {
    question: "Do you work outside Albania?",
    answer:
      "Yes. The practice is based in Tirana and can support selected residential, interior, hospitality, and cultural projects internationally.",
  },
];

const journey = [
  {
    stage: "01",
    title: "We uncover the place",
    description:
      "We listen closely, study the site, and turn needs, constraints, climate, and daily rituals into one clear architectural direction.",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  },
  {
    stage: "02",
    title: "We shape the architecture",
    description:
      "Plans, proportions, material studies, daylight, consultants, and approvals are developed together so every decision supports the whole.",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  },
  {
    stage: "03",
    title: "We carry it through",
    description:
      "Detail, cost, craft, and site coordination keep the original idea intact as drawings become rooms, surfaces, and lived experience.",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  },
];

type StepMediaProps = {
  image: string;
  stage: string;
};

function StepMedia({ image, stage }: StepMediaProps) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const moveTooltip = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    xTo.current?.(event.clientX - bounds.left + 42);
    yTo.current?.(event.clientY - bounds.top + 48);
  };

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    xTo.current = gsap.quickTo(tooltip, "x", {
      duration: 0.25,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(tooltip, "y", {
      duration: 0.25,
      ease: "power3.out",
    });

    return () => gsap.killTweensOf(tooltip);
  }, []);

  return (
    <figure
      className="process__step-media"
      data-hover="link"
      onPointerEnter={moveTooltip}
      onPointerMove={moveTooltip}
    >
      <div className="process__step-image">
        <img src={image} alt="" data-parallax="5" />
      </div>
      <span ref={tooltipRef} className="process__step-tooltip" aria-hidden="true">
        <span className="process__step-tooltip-content">
          See step {stage} in action
          <img src={arrow} alt="" />
        </span>
      </span>
    </figure>
  );
}

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(2);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray<HTMLElement>(".process__step").forEach((step) => {
        const copy = step.querySelector(".process__step-copy");
        const media = step.querySelector(".process__step-media");

        gsap.from(copy, {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 76%" },
        });

        gsap.from(media, {
          clipPath: "inset(10% 0 10% 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 82%" },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="process" id="process">
      <div className="process__intro">
        <div className="process__intro-grid">
          <aside className="process__note">
            <span className="mono">A considered process</span>
            <p>
              Every commission stays personal, direct, and grounded from the
              first conversation through the final detail.
            </p>
          </aside>

          <div className="process__services">
            <p className="process__label">
              <span aria-hidden="true" />
              What we can help with
            </p>
            <ul>
              {services.map((service, index) => (
                <li className={index === activeService ? "is-active" : undefined} key={service.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveService(index)}
                    onFocus={() => setActiveService(index)}
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <figure className="process__intro-media">
            {services.map((service, index) => (
              <img
                className={index === activeService ? "is-active" : undefined}
                src={service.image}
                alt={index === activeService ? service.title : ""}
                aria-hidden={index !== activeService}
                data-preview={String(index + 1)}
                key={service.title}
              />
            ))}
          </figure>
        </div>

        <h2 className="process__journey-title">Project Journey</h2>
      </div>

      <div className="process__steps">
        {journey.map((item) => (
          <article className="process__step" key={item.stage}>
            <span className="process__step-number mono">Step — {item.stage}</span>
            <div className="process__step-copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <StepMedia image={item.image} stage={item.stage} />
          </article>
        ))}
      </div>

      <section className="process__faq" aria-labelledby="process-faq-title">
        <div className="process__faq-label">
          <span aria-hidden="true" />
          FAQs
        </div>
        <div className="process__faq-content">
          <h2 id="process-faq-title">
            What to know before starting a project.
          </h2>
          <div className="process__faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className="process__faq-answer">
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
