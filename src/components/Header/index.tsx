import "./style.scss";

const baseUrl = import.meta.env.BASE_URL;

const navigation = [
  { label: "Work", href: `${baseUrl}work` },
  { label: "Studio", href: `${baseUrl}studio` },
  { label: "Process", href: `${baseUrl}process` },
  { label: "Gallery", href: `${baseUrl}gallery` },
] as const;

type HeaderProps = {
  noiseEnabled: boolean;
  onNoiseToggle: () => void;
};

export default function Header({
  noiseEnabled,
  onNoiseToggle,
}: HeaderProps) {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const activePage = /\/works?$/.test(pathname)
    ? "Work"
    : pathname.endsWith("/studio")
      ? "Studio"
      : pathname.endsWith("/process")
        ? "Process"
        : pathname.endsWith("/gallery")
          ? "Gallery"
          : null;
  const grainLabel = noiseEnabled ? "Turn off grain" : "Turn on grain";

  return (
    <header className="header site-header" id="site-header">
      <div className="header-wrapp">
        <a
          href={baseUrl}
          className="header-logo"
          aria-label="Go home"
          data-hover="link"
          data-magnetic
        >
          <span className="header-logo__anchor">
            <span className="header-logo__mark" aria-hidden="true">
              <img
                className="header-logo__image header-logo__image--dark"
                src={`${baseUrl}logo-dark.svg`}
                alt=""
              />
              <img
                className="header-logo__image header-logo__image--light"
                src={`${baseUrl}logo-light.svg`}
                alt=""
              />
            </span>
            <span className="header-tip" aria-hidden="true">
              Go home
            </span>
          </span>
        </a>

        <div className="header-primary">
          <nav className="header-menu" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`header-menu__item header-link${
                  activePage === item.label ? " is-active" : ""
                }`}
                aria-current={activePage === item.label ? "page" : undefined}
                data-hover="link"
              >
                <span className="header-text-effect">
                  <span className="header-text-effect__track">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          <span className="header-tip-wrap">
            <button
              className="grain-switch"
              type="button"
              aria-label={grainLabel}
              aria-pressed={noiseEnabled}
              onClick={onNoiseToggle}
              data-hover="link"
              data-magnetic
            >
              <span className="grain-switch__field" aria-hidden="true" />
            </button>
            <span className="header-tip" aria-hidden="true">
              {grainLabel}
            </span>
          </span>

          <a
            href="mailto:hello@arbermanga.com"
            className="header-contact header-link header-action"
            data-hover="link"
            data-magnetic
          >
            <span className="header-text-effect">
              <span className="header-text-effect__track">
                <span>Start a Project</span>
                <span aria-hidden="true">Start a Project</span>
              </span>
            </span>
            <span className="header-action__icon" aria-hidden="true">
              <span className="header-contact__arrow" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
