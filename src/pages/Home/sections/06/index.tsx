import ColorBends from "@/components/ColorBends";
import "./style.scss";

const invitationColors = ["#d1d1c7", "#6b645c", "#b97e56"] as const;

export default function ProjectInvitation() {
  return (
    <section
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
          (Contact)
        </p>
        <h2 id="project-invitation-title">
          <span data-reveal="up">Let’s shape</span>
          <span data-reveal="up">places that feel</span>
          <span data-reveal="up">lived in.</span>
        </h2>
      </div>
    </section>
  );
}
