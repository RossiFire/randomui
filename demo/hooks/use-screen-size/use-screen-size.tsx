"use client";

import { useEffect, useMemo, useState } from "react";

interface ScreenSizeOptions {
  transformTo: "%" | "px";
}

const useScreenSize = (options?: ScreenSizeOptions) => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? document.documentElement.clientWidth : 0,
    height: typeof window !== "undefined" ? document.documentElement.clientHeight : 0,
  });

  const baseWindowSize = useMemo(()=>({
    width: typeof window !== "undefined" ? window.outerWidth : 0,
    height: typeof window !== "undefined" ? window.outerHeight : 0,
  }), []);

  useEffect(() => {
    const handleResize = () =>
      setScreenSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  switch(options?.transformTo) {
    case "%":
      return {
        width: Math.round(screenSize.width * 100 / baseWindowSize.width),
        height: Math.round(screenSize.height * 100 / baseWindowSize.height),
      };
    case "px": default:
      return screenSize;
  }

};

export default useScreenSize;
