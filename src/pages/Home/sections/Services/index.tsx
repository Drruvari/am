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
      <p className="services__eyebrow eyebrow mono">05 — Services</p>

      <div className="services__intro">
        <h2>Scope</h2>
        <p>
          Focused architectural support from early spatial strategy to detailed
          design and execution coordination.
        </p>
      </div>

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
