import './style.scss'
import Logo from '@/components/Logo/index'

function MobileMenu() {
  return (
    <div className="nav-drawer" id="mobileMenu" aria-hidden="true">
      <div className="nav-drawer__backdrop" id="mobileMenuBackdrop" />
      <div className="nav-drawer__panel" data-lenis-prevent>
        <div className="btn btn--pill btn--soft nav-drawer__close-wrap">
          <button
            className="nav-drawer__close mono"
            id="mobileMenuClose"
            type="button"
            aria-label="Close menu"
          >
            <span className="btn__label">
              <span>Close</span>
            </span>
          </button>
        </div>
        <nav className="nav-drawer__nav" aria-label="Mobile navigation">
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
        <div className="nav-drawer__meta mono">
          <p>hello@arbermanga.com</p>
          <p>Blloku District, Tirana, AL</p>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  return (
    <>
      <header className="site-header header" id="site-header">
        <a
          href="#top"
          className="site-header__logo"
          aria-label="AM Architecture home"
          data-hover="link"
        >
          <Logo className="site-header__logo-svg" />
        </a>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <a href="#work" data-hover="link">
            Works
          </a>
          <span>Studio</span>
          <span>Process</span>
          <a href="#gallery" data-hover="link">
            Gallery
          </a>
        </nav>
        <div className="site-header__actions">
          <div className="btn btn--pill btn--fill btn--dark site-header__contact">
            <a
              href="mailto:hello@arbermanga.com"
              className="site-header__contact-link"
              data-hover="link"
            >
              <span className="btn__label">
                <span>Get in Touch</span>
              </span>
            </a>
          </div>
          <div className="btn btn--pill btn--soft site-header__menu">
            <button
              type="button"
              className="site-header__menu-btn"
              id="mobileMenuOpen"
              aria-expanded="false"
              aria-controls="mobileMenu"
              data-hover="link"
            >
              <span className="btn__label">
                <span>Menu</span>
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  )
}
