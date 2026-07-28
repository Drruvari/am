import BubbleMenu from "@/components/BubbleMenu";
import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
import Noise from "@/components/Noise";
import PageTransition from "@/components/PageTransition";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import Studio from "@/pages/Studio";
import Works from "@/pages/Works";
import { useEffect } from "react";

const mobileNavigation = [
  {
    label: "Home",
    href: "/",
    ariaLabel: "Home",
    rotation: -8,
  },
  {
    label: "Studio",
    href: "/studio",
    ariaLabel: "Studio",
    rotation: 8,
  },
  {
    label: "Work",
    href: "/works",
    ariaLabel: "Selected work",
    rotation: -5,
  },
  {
    label: "Services",
    href: "#process",
    ariaLabel: "Services",
    rotation: 7,
  },
  {
    label: "Contact",
    href: "#contact",
    ariaLabel: "Contact",
    rotation: -8,
  },
] as const;

export default function App() {
  const isWorksPage = window.location.pathname.includes("/works");
  const isStudioPage = window.location.pathname.includes("/studio");

  useEffect(() => {
    initApp();
    return () => disposeApp();
  }, []);

  return (
    <>
      <PageTransition />
      <Noise
        className="noise-overlay--fixed"
        patternAlpha={6}
        patternRefreshInterval={4}
        patternScaleX={1}
        patternScaleY={1}
        patternSize={1024}
      />
      <CustomCursor />
      <Header />
      <BubbleMenu
        logo={<span>ARBËR MANGA</span>}
        items={mobileNavigation}
        menuAriaLabel="Toggle navigation"
        menuBg="#d1d1c7"
        menuContentColor="#ffffff"
        useFixedPosition
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      />
      {isWorksPage ? <Works /> : isStudioPage ? <Studio /> : <Home />}
    </>
  );
}
