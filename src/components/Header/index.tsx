import { useEffect } from "react";
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
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void import("@/lib/animations").then(({ initHeaderTheme }) => {
      if (!cancelled) cleanup = initHeaderTheme();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const activePage = /\/works?$/.test(pathname)
    ? "Work"
    : pathname.endsWith("/studio")
      ? "Studio"
      : pathname.endsWith("/process")
        ? "Process"
        : null;

  return (
    <header className="header site-header" id="site-header">
      <div className="header-wrapp">
        <a
          href={baseUrl}
          className="header-logo"
          aria-label="Arbër Manga home"
          data-hover="link"
        >
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
          <button
            className="grain-switch"
            type="button"
            aria-label={`${noiseEnabled ? "Turn off" : "Turn on"} grain`}
            aria-pressed={noiseEnabled}
            title={`${noiseEnabled ? "Turn off" : "Turn on"} grain`}
            onClick={onNoiseToggle}
            data-hover="link"
          >
            <span className="grain-switch__field" aria-hidden="true" />
          </button>

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
