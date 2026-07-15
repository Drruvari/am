import Logo from "@/components/Logo/index";
import Button from "@/components/Button";
import { lenis } from "@/lib/smooth-scroll";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import "./style.scss";

type MenuItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "Work", href: "#work" },
  { label: "Studio", disabled: true },
  { label: "Process", disabled: true },
  { label: "Gallery", href: "#featured-project" },
  { label: "Contact Us", href: "mailto:hello@arbermanga.com" },
];

export default function Header() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  function getEls() {
    const root = rootRef.current;
    const menu = menuRef.current;
    if (!root || !menu) return null;

    return {
      menu,
      trigger: root.querySelector<HTMLElement>(".header-menu-trigger"),
      overlay: menu.querySelector<HTMLElement>("[data-header-menu-overlay]"),
      panel: menu.querySelector<HTMLElement>("[data-header-menu-panel]"),
      bgPanels: menu.querySelectorAll<HTMLElement>("[data-header-menu-bg]"),
      links: menu.querySelectorAll<HTMLElement>("[data-header-menu-link]"),
      fadeItems: menu.querySelectorAll<HTMLElement>("[data-header-menu-fade]"),
      buttonIcon: root.querySelector<SVGSVGElement>(
        "[data-header-menu-button-icon]",
      ),
    };
  }

  function openMenu() {
    const els = getEls();
    if (!els?.overlay || !els.panel || !els.buttonIcon) return;
    if (isOpenRef.current) return;

    isOpenRef.current = true;
    setIsOpen(true);
    els.menu.dataset.nav = "open";
    document.body.classList.add("is-menu-open");
    lenis.stop();
    if (els.trigger) gsap.set(els.trigger, { x: 0, y: 0 });

    const tl =
      timelineRef.current ??
      gsap.timeline({
        defaults: { ease: "headerMenuEase", duration: 0.7 },
      });
    timelineRef.current = tl;

    tl.clear()
      .set(els.menu, { display: "block" })
      .set(els.panel, { xPercent: 0 })
      .set(els.links, { yPercent: 140, rotate: 10 })
      .set(els.fadeItems, { autoAlpha: 0, yPercent: 50 })
      .set(els.bgPanels, { xPercent: 101 })
      .fromTo(els.buttonIcon, { rotate: 0 }, { rotate: 315 }, 0)
      .fromTo(els.overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, 0)
      .to(els.bgPanels, { xPercent: 0, stagger: 0.12, duration: 0.575 }, 0)
      .to(els.links, { yPercent: 0, rotate: 0, stagger: 0.05 }, 0.35)
      .to(els.fadeItems, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, 0.55);
  }

  function closeMenu() {
    const els = getEls();
    if (!els?.overlay || !els.panel || !els.buttonIcon) return;
    if (!isOpenRef.current) return;

    isOpenRef.current = false;
    setIsOpen(false);
    els.menu.dataset.nav = "closed";
    document.body.classList.remove("is-menu-open");

    const tl =
      timelineRef.current ??
      gsap.timeline({
        defaults: { ease: "headerMenuEase", duration: 0.7 },
      });
    timelineRef.current = tl;

    tl.clear()
      .to(els.overlay, { autoAlpha: 0, duration: 0.45 })
      .to(els.panel, { xPercent: 120, duration: 0.55 }, "<")
      .to(els.buttonIcon, { rotate: 0, duration: 0.45 }, "<")
      .set(els.menu, { display: "none" })
      .add(() => {
        lenis.start();
        ScrollTrigger.refresh(true);
      });
  }

  function toggleMenu() {
    if (isOpenRef.current) closeMenu();
    else openMenu();
  }

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("headerMenuEase", "0.65, 0.01, 0.05, 0.99");

    const els = getEls();
    if (els) {
      gsap.set(els.menu, { display: "none" });
      gsap.set(els.overlay, { autoAlpha: 0 });
      gsap.set(els.buttonIcon, { rotate: 0 });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpenRef.current) closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      timelineRef.current?.kill();
      document.body.classList.remove("is-menu-open");
      lenis.start();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <header className="header site-header" id="site-header">
        <div className="header-wrapp">
          <a
            href="#top"
            className="header-logo"
            aria-label="AM Architecture home"
            data-hover="link"
          >
            <Logo className="header-logo__mark site-header__logo" />
          </a>

          <a
            className="header-search header-link"
            href="#featured-project"
            data-hover="link"
          >
            View Project
          </a>

          <nav className="header-menu" aria-label="Primary">
            <a
              href="#work"
              className="header-menu__item header-link"
              data-hover="link"
            >
              Work
            </a>
            <span className="header-menu__item header-link is-disabled">
              Studio
            </span>
            <span className="header-menu__item header-link is-disabled">
              Process
            </span>
            <a
              href="#featured-project"
              className="header-menu__item header-link"
              data-hover="link"
            >
              Gallery
            </a>
          </nav>

          <a
            href="mailto:hello@arbermanga.com"
            className="header-contact header-link header-action"
            data-hover="link"
            data-magnetic
          >
            <span className="header-text-effect">
              <span className="header-text-effect__track">
                <span>Get in Touch</span>
                <span aria-hidden="true">Get in Touch</span>
              </span>
            </span>
            <span className="header-action__icon" aria-hidden="true">
              <span className="header-contact__arrow" />
            </span>
          </a>

          <Button
            variant="pill"
            className="header-cart header-action header-action--menu"
            innerClassName="header-link header-menu-trigger"
            labelClassName="header-menu-trigger__label"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="headerWipeMenu"
            data-hover="link"
            onClick={toggleMenu}
          >
            <span className="header-menu-trigger__copy">
              <span className="header-text-effect__track">
                <span>{isOpen ? "Close" : "Menu"}</span>
                <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
              </span>
            </span>
            <span className="header-menu-trigger__icon-wrap">
              <svg
                data-header-menu-button-icon
                className="header-menu-trigger__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 2V14M2 8H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Button>
        </div>
      </header>

      <div
        id="headerWipeMenu"
        ref={menuRef}
        className="header-wipe-menu"
        data-nav="closed"
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="header-wipe-menu__overlay"
          data-header-menu-overlay
          data-hover="link"
          aria-label="Close menu"
          onClick={closeMenu}
        />

        <nav
          className="header-wipe-menu__panel"
          data-header-menu-panel
          data-lenis-prevent
          aria-label="Menu navigation"
        >
          <div className="header-wipe-menu__bg">
            <div
              className="header-wipe-menu__bg-panel header-wipe-menu__bg-panel--first"
              data-header-menu-bg
            />
            <div
              className="header-wipe-menu__bg-panel header-wipe-menu__bg-panel--second"
              data-header-menu-bg
            />
            <div className="header-wipe-menu__bg-panel" data-header-menu-bg />
          </div>

          <div className="header-wipe-menu__inner">
            <ul className="header-wipe-menu__list">
              {menuItems.map((item, index) => (
                <li className="header-wipe-menu__item" key={item.label}>
                  {item.disabled ? (
                    <span
                      className="header-wipe-menu__link is-disabled"
                      data-header-menu-link
                      aria-disabled="true"
                    >
                      <span className="header-wipe-menu__link-heading">
                        {item.label}
                      </span>
                      <span className="header-wipe-menu__link-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="header-wipe-menu__link-bg" />
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className="header-wipe-menu__link"
                      data-header-menu-link
                      data-hover="link"
                      onClick={closeMenu}
                    >
                      <span className="header-wipe-menu__link-heading">
                        {item.label}
                      </span>
                      <span className="header-wipe-menu__link-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="header-wipe-menu__link-bg" />
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <div className="header-wipe-menu__details">
              <p className="header-wipe-menu__label" data-header-menu-fade>
                Contact
              </p>
              <div className="header-wipe-menu__meta">
                <a
                  href="mailto:hello@arbermanga.com"
                  className="header-wipe-menu__meta-link"
                  data-header-menu-fade
                  data-hover="link"
                  onClick={closeMenu}
                >
                  hello@arbermanga.com
                </a>
                <p
                  className="header-wipe-menu__meta-text"
                  data-header-menu-fade
                >
                  Blloku District, Tirana, AL
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
