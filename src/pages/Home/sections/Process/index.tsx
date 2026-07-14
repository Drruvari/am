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
  return (
    <section className="process" id="process">
      <p className="process__eyebrow eyebrow mono">06 — Process</p>

      <div className="process__intro">
        <h2>Process</h2>
        <p>
          A clear sequence keeps the work calm, legible, and controlled from
          first conversation to site execution.
        </p>
      </div>

      <div className="process__steps">
        {steps.map(([number, title, text]) => (
          <article className="process__step" key={number}>
            <span className="process__number mono">{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
