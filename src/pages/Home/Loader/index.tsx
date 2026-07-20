import "./style.scss";

const images = [
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg",
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
