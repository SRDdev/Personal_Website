"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type GoatCounter = {
  count?: (options: { path: string }) => void;
};

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

export default function GoatCounterTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let attempts = 0;
    const countPageView = () => {
      if (window.goatcounter?.count) {
        window.goatcounter.count({ path: pathname });
        return;
      }

      if (attempts < 20) {
        attempts += 1;
        window.setTimeout(countPageView, 100);
      }
    };

    countPageView();
  }, [pathname]);

  return null;
}
