import { PLACEHOLDER_FLAG, PLACEHOLDER_HEX } from "@/lib/loader-paths";
import "./style.scss";

export default function Loader() {
  return (
    <>
      <div
        className="loader"
        id="loader"
        aria-label="Loading portfolio"
        aria-busy="true"
      >
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

        <div className="loader__pct">
          Loading&nbsp;
          <span className="loader__progress-value" id="loaderCount">
            0
          </span>
          %
        </div>

        <p className="visually-hidden" id="loaderStatus" aria-live="polite">
          Loading, 0 percent
        </p>
      </div>

      <div className="loader-curtain" aria-hidden="true" />
    </>
  );
}
