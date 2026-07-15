import { PLACEHOLDER_FLAG, PLACEHOLDER_HEX } from "@/lib/loader-paths";
import "./style.scss";

const letters = ["L", "O", "A", "D", "I", "N", "G"];
const transitionRows = Array.from({ length: 5 });

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
        <div className="loader__progress" aria-hidden="true">
          <span className="loader__progress-track">
            <span className="loader__progress-bar" />
          </span>
        </div>

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
        </div>

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

        <p className="visually-hidden" id="loaderStatus" aria-live="polite">
          Loading portfolio
        </p>
      </div>

      <div className="loader-transition" aria-hidden="true">
        {transitionRows.map((_, index) => (
          <div className="loader-transition__row" key={index}>
            <span className="loader-transition__block loader-transition__block--left" />
            <span className="loader-transition__block loader-transition__block--right" />
          </div>
        ))}
      </div>
    </>
  );
}
