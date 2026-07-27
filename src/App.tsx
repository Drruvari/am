import BubbleMenu from "@/components/BubbleMenu";
import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
import Noise from "@/components/Noise";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import { useEffect } from "react";

const mobileNavigation = [
  {
    label: "Home",
    href: "#top",
    ariaLabel: "Home",
    rotation: -8,
  },
  {
    label: "Studio",
    href: "#featured-project",
    ariaLabel: "Studio",
    rotation: 8,
  },
  {
    label: "Work",
    href: "#work",
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
  useEffect(() => {
    initApp();
    return () => disposeApp();
  }, []);

  return (
    <>
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
        menuContentColor="#080807"
        useFixedPosition
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      />
      <Home />
    </>
  );
}
