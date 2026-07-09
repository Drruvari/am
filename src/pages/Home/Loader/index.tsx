import './style.scss'
import Logo from '@/components/Logo/index'

export default function Loader() {
  return (
    <div
      className="loader"
      id="loader"
      aria-label="Loading portfolio"
      aria-busy="true"
    >
      <div className="loader__brand" aria-hidden="true">
        <Logo idPrefix="loader-" className="loader__logo" />
      </div>
      <div className="loader__meta">
        <p className="loader__tagline">
          <span>Studies in structure and light.</span>
        </p>
        <p className="visually-hidden" id="loaderStatus" aria-live="polite">
          Loading, 0 percent
        </p>
      </div>
      <div className="loader__progress" aria-hidden="true">
        <span className="loader__progress-value" aria-hidden="true">
          0
        </span>
        <span className="loader__progress-unit" aria-hidden="true">
          %
        </span>
      </div>
    </div>
  )
}
