"use client";

import { useEffect } from "react";

export function useHeaderObserver() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    const setHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        header.offsetHeight + "px"
      );
    };

    const onScrollHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    setHeaderHeight();
    onScrollHeader();

    window.addEventListener("resize", setHeaderHeight);
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    return () => {
      window.removeEventListener("resize", setHeaderHeight);
      window.removeEventListener("scroll", onScrollHeader);
    };
  }, []);
}
