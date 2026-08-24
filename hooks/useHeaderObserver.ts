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

    /* One class flip per rendered frame, not one per scroll event.
       ------------------------------------------------------------------
       A trackpad or a smooth wheel fires scroll several times between two
       frames, and each call read window.scrollY — a read that has to flush any
       pending style before it can answer. Since the only thing the handler can
       do is set a class that the next paint picks up, doing it more than once
       per frame cannot change what anyone sees.

       .is-scrolled transitions background-color, box-shadow and backdrop-filter
       on the fixed header, so the flip still lands in the same frame the old
       code would have painted it in; only the redundant calls in between are
       gone. */
    let scrollFrame = 0;
    const readScrolled = () => {
      scrollFrame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    const onScrollHeader = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(readScrolled);
    };

    setHeaderHeight();
    readScrolled();

    window.addEventListener("resize", setHeaderHeight);
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    return () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      window.removeEventListener("resize", setHeaderHeight);
      window.removeEventListener("scroll", onScrollHeader);
    };
  }, []);
}
