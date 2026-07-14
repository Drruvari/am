import {
  SectionEyebrow,
  SectionIntro,
} from "@/components/SectionHeader";

const services = [
  "Architecture",
  "Interior design",
  "Renovation",
  "Concept design",
  "Planning / permits",
  "3D visualization",
];

export default function Services() {
  return (
    <section className="services" id="services">
      <SectionEyebrow className="services__eyebrow">
        05 — Services
      </SectionEyebrow>

      <SectionIntro className="services__intro" title="Scope">
        Focused architectural support from early spatial strategy to detailed
        design and execution coordination.
      </SectionIntro>

      <div className="services__grid">
        {services.map((service) => (
          <div className="services__item mono" key={service}>
            {service}
          </div>
        ))}
      </div>
    </section>
  );
}
