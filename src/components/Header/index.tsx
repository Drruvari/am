import Button from "@/components/Button";
import Logo from "@/components/Logo/index";
import "./style.scss";

function MobileMenu() {
  return (
    <div className="menu" id="mobileMenu" aria-hidden="true">
      <div className="menu__backdrop" id="mobileMenuBackdrop" />
      <div className="menu__panel" data-lenis-prevent>
        <Button
          variant="pill"
          theme="soft"
          className="menu__close-wrap"
          innerClassName="menu__close mono"
          id="mobileMenuClose"
          type="button"
          aria-label="Close menu"
        >
          Close
        </Button>
        <nav className="menu__nav" aria-label="Mobile navigation">
          <a href="#top" data-hover="link">
            Home
          </a>
          <a href="#work" data-hover="link">
            Works
          </a>
          <span>In Progress</span>
          <a href="#work" data-hover="link">
            Archive
          </a>
          <span>Studio</span>
          <span>Process</span>
          <a href="#gallery" data-hover="link">
            Gallery
          </a>
          <a href="mailto:hello@arbermanga.com" data-hover="link">
            Contact Us
          </a>
        </nav>
        <div className="menu__meta mono">
          <p>hello@arbermanga.com</p>
          <p>Blloku District, Tirana, AL</p>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <>
      <header className="header" id="site-header">
        <a
          href="#top"
          className="header__logo"
          aria-label="AM Architecture home"
          data-hover="link"
        >
          <Logo className="header__logo-svg" />
        </a>
        <nav className="header__nav" aria-label="Primary navigation">
          <a href="#work" data-hover="link">
            Works
          </a>
          <span>Studio</span>
          <span>Process</span>
          <a href="#gallery" data-hover="link">
            Gallery
          </a>
        </nav>
        <div className="header__actions">
          <Button
            variant="pill"
            theme="dark"
            fill
            href="mailto:hello@arbermanga.com"
            className="header__contact"
            innerClassName="header__contact-link"
            data-hover="link"
          >
            <span>Get in Touch</span>
          </Button>
          <Button
            variant="pill"
            theme="soft"
            className="header__menu"
            innerClassName="header__menu-btn"
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
