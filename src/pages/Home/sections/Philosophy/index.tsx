import { SectionEyebrow } from "@/components/SectionHeader";

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <SectionEyebrow className="philosophy__eyebrow">
        03 — Philosophy
      </SectionEyebrow>

      <div className="philosophy__body">
        <p>Architecture begins with what already exists.</p>
        <p>
          Light, proportion, material, context, and restraint shape each
          decision.
        </p>
        <p>
          The result is spatial work that feels quiet, precise, and durable.
        </p>
      </div>
    </section>
  );
}
