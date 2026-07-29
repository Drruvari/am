import BubbleMenu from "@/components/BubbleMenu";
import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
import Noise from "@/components/Noise";
import PageTransition from "@/components/PageTransition";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import { lazy, Suspense, useEffect, useState } from "react";

const Gallery = lazy(() => import("@/pages/Gallery"));
const ProcessPage = lazy(() => import("@/pages/Process"));
const Studio = lazy(() => import("@/pages/Studio"));
const Works = lazy(() => import("@/pages/Works"));

const baseUrl = import.meta.env.BASE_URL;

const mobileNavigation = [
  {
    label: "Work",
    href: `${baseUrl}work`,
    ariaLabel: "Selected work",
    rotation: -8,
  },
  {
    label: "Studio",
    href: `${baseUrl}studio`,
    ariaLabel: "Studio",
    rotation: 8,
  },
  {
    label: "Process",
    href: `${baseUrl}process`,
    ariaLabel: "Process",
    rotation: -5,
  },
  {
    label: "Gallery",
    href: `${baseUrl}gallery`,
    ariaLabel: "Gallery",
    rotation: 7,
  },
] as const;

function getRouteFlags(pathname = window.location.pathname) {
  return {
    isWorksPage: /\/works?\/?$/.test(pathname),
    isStudioPage: pathname.includes("/studio"),
    isProcessPage: pathname.includes("/process"),
    isGalleryPage: pathname.includes("/gallery"),
  };
}

export default function App() {
  const [noiseEnabled, setNoiseEnabled] = useState(() => {
    try {
      return window.localStorage.getItem("am-noise") !== "off";
    } catch {
      return true;
    }
  });
  const { isWorksPage, isStudioPage, isProcessPage, isGalleryPage } =
    getRouteFlags();

  useEffect(() => {
    if (isGalleryPage) {
      document.documentElement.classList.remove("is-entering", "is-loading");
      return;
    }

    let cancelled = false;
    let raf = 0;
    const needsHome = !isWorksPage && !isStudioPage && !isProcessPage;

    const boot = () => {
      if (cancelled) return;

      if (needsHome && !document.querySelector(".home-page")) {
        raf = window.requestAnimationFrame(boot);
        return;
      }

      initApp();
    };

    boot();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      disposeApp();
    };
  }, [isGalleryPage, isWorksPage, isStudioPage, isProcessPage]);

  const toggleNoise = () => {
    setNoiseEnabled((enabled) => {
      const next = !enabled;
      try {
        window.localStorage.setItem("am-noise", next ? "on" : "off");
      } catch {
        // Preference remains active for the current session.
      }
      return next;
    });
  };

  let page = <Home />;
  if (isGalleryPage) page = <Gallery />;
  else if (isWorksPage) page = <Works />;
  else if (isStudioPage) page = <Studio />;
  else if (isProcessPage) page = <ProcessPage />;

  return (
    <>
      <PageTransition />
      {noiseEnabled && (
        <Noise
          className="noise-overlay--fixed"
          patternAlpha={2}
          patternRefreshInterval={12}
          patternScaleX={1}
          patternScaleY={1}
          patternSize={256}
        />
      )}
      <CustomCursor />
      {!isGalleryPage && (
        <Header noiseEnabled={noiseEnabled} onNoiseToggle={toggleNoise} />
      )}
      {!isGalleryPage && (
        <BubbleMenu
          logo={
            <span className="mobile-logo-mark" aria-hidden="true">
              <img
                className="mobile-logo-mark__dark"
                src={`${baseUrl}logo-dark.svg`}
                alt=""
              />
              <img
                className="mobile-logo-mark__light"
                src={`${baseUrl}logo-light.svg`}
                alt=""
              />
            </span>
          }
          items={mobileNavigation}
          menuAriaLabel="Toggle navigation"
          menuBg="#d1d1c7"
          menuContentColor="#080807"
          noiseEnabled={noiseEnabled}
          onNoiseToggle={toggleNoise}
          useFixedPosition
          animationEase="power3.out"
          animationDuration={0.55}
          staggerDelay={0.08}
        />
      )}
      {isGalleryPage || isWorksPage || isStudioPage || isProcessPage ? (
        <Suspense fallback={null}>{page}</Suspense>
      ) : (
        page
      )}
    </>
  );
}
