import { PLACEHOLDER_FLAG, PLACEHOLDER_HEX } from "@/lib/loader-paths";
import "./style.scss";

const letters = ["L", "O", "A", "D", "I", "N", "G"];

export default function Loader() {
  return (
    <>
      <div
        className="loader"
        id="loader"
        role="status"
        aria-label="Loading portfolio"
        aria-busy="true"
      >
        <div className="loader__content">
          <svg
            className="loader__mark"
            viewBox="0 0 962 421"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path id="shape-hex" d={PLACEHOLDER_HEX} />
            <path id="shape-flag" d={PLACEHOLDER_FLAG} />
          </svg>

          <div className="loader__loading" aria-hidden="true">
            {letters.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <p className="visually-hidden" id="loaderStatus" aria-live="polite">
          Loading portfolio
        </p>
      </div>

      <div className="loader-curtain" aria-hidden="true" />
    </>
  );
}
