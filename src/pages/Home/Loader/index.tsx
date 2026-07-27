import "./style.scss";

const images = [
  "/assets/images/arch.jpg",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
] as const;

export default function Loader() {
  return (
    <section
      className="stack-loader"
      id="loader"
      role="status"
      aria-label="Loading portfolio"
      aria-busy="true"
    >
      <div className="stack-loader__layout">
        <p className="stack-loader__heading" data-loader-heading>
          HUMAN SPACES
        </p>

        <div className="stack-loader__images" data-loader-images>
          {images.map((src, index) => (
            <div className="stack-loader__image" key={src}>
              <img
                src={src}
                alt=""
                width={1000}
                height={1000}
                loading="eager"
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>

        <p className="stack-loader__heading" data-loader-heading>
          ENDURING FORM
        </p>
      </div>

      <p className="stack-loader__description" data-loader-description>
        ARBËR MANGA
      </p>

      <span className="visually-hidden" id="loaderStatus" aria-live="polite">
        Loading portfolio
      </span>
    </section>
  );
}
