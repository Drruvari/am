import Button from "@/components/Button";
import Logo from "@/components/Logo/index";
import "./style.scss";

function MobileMenu() {
  return (
    <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
      <div className="mobile-menu__backdrop" id="mobileMenuBackdrop" />
      <div className="mobile-menu__panel" data-lenis-prevent>
        <Button
          variant="pill"
          theme="soft"
          className="mobile-menu__close"
          innerClassName="mobile-menu__close-button mono"
          id="mobileMenuClose"
          type="button"
          aria-label="Close menu"
        >
          Close
        </Button>
        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          <a className="mobile-menu__nav-link" href="#top" data-hover="link">
            Home
          </a>
          <a className="mobile-menu__nav-link" href="#work" data-hover="link">
            Works
          </a>
          <span className="mobile-menu__nav-item is-disabled">In Progress</span>
          <a className="mobile-menu__nav-link" href="#work" data-hover="link">
            Archive
          </a>
          <span className="mobile-menu__nav-item is-disabled">Studio</span>
          <span className="mobile-menu__nav-item is-disabled">Process</span>
          <a className="mobile-menu__nav-link" href="#gallery" data-hover="link">
            Gallery
          </a>
          <a
            className="mobile-menu__nav-link"
            href="mailto:hello@arbermanga.com"
            data-hover="link"
          >
            Contact Us
          </a>
        </nav>
        <div className="mobile-menu__meta mono">
          <p className="mobile-menu__meta-item">hello@arbermanga.com</p>
          <p className="mobile-menu__meta-item">Blloku District, Tirana, AL</p>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <>
      <header className="site-header" id="site-header">
        <a
          href="#top"
          className="site-header__brand"
          aria-label="AM Architecture home"
          data-hover="link"
        >
          <Logo className="site-header__logo" />
        </a>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <a className="site-header__nav-link" href="#work" data-hover="link">
            Works
          </a>
          <span className="site-header__nav-item is-disabled">Studio</span>
          <span className="site-header__nav-item is-disabled">Process</span>
          <a className="site-header__nav-link" href="#gallery" data-hover="link">
            Gallery
          </a>
        </nav>
        <div className="site-header__actions">
          <Button
            variant="pill"
            theme="dark"
            fill
            href="mailto:hello@arbermanga.com"
            className="site-header__contact"
            innerClassName="site-header__contact-link"
            data-hover="link"
          >
            <span>Get in Touch</span>
          </Button>
          <Button
            variant="pill"
            theme="soft"
            className="site-header__menu-trigger"
            innerClassName="site-header__menu-button"
            id="mobileMenuOpen"
            aria-expanded="false"
            aria-controls="mobileMenu"
            data-hover="link"
          >
            <span>Menu</span>
          </Button>
        </div>
      </header>
      <MobileMenu />
    </>
  );
}
