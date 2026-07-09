"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll window to top in case the body scrolled due to mobile browser 100dvh differences
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const container = document.getElementById("main-scroll-container");
    if (container) {
      // Use setTimeout to ensure DOM is ready and override Next.js default scroll handling
      setTimeout(() => {
        container.scrollTop = 0;
        window.scrollTo(0, 0); // Double check window scroll
      }, 10);
    }
  }, [pathname]);

  return null;
}
