import "./style.scss";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#featured-project" },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#work" },
] as const;

export default function Header() {
  return (
    <header className="header site-header" id="site-header">
      <div className="header-wrapp">
        <a
          href="#top"
          className="header-logo"
          aria-label="Arbër Manga home"
          data-hover="link"
        >
          <span className="header-logo__wordmark">ARBËR MANGA</span>
        </a>

        <div className="header-primary">
          <nav className="header-menu" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="header-menu__item header-link"
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
    </header>
  );
}
