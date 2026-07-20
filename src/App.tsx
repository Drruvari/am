import CustomCursor from "@/components/CustomCursor/index";
import Grain from "@/components/Grain";
import Header from "@/components/Header/index";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import Loader from "@/pages/Home/Loader";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    initApp();
    return () => disposeApp();
  }, []);

  return (
    <>
      <Loader />
      <Grain />
      <CustomCursor />
      <Header />
      <Home />
    </>
  );
}
