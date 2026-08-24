"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { HeroBackground } from "./HeroBackground";

/* The fit pass has to land before the browser paints, or a short phone shows
   one frame of the un-shrunk hero. useLayoutEffect does that but warns when
   React renders this page on the server, so fall back to useEffect there —
   nothing paints during SSR for it to be early for. */
const useFitEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  /* Below 1024px the hero is one viewport tall and pinned at top:0, so it is
     already at rest on load and the white stack rises over it from the first
     pixel of scroll. That only holds while the content actually fits: the
     stylesheet sizes every piece against svh for exactly that reason, but its
     clamps bottom out, and a long webfont swap or a very short viewport can
     still leave the third rating card past the fold.

     So measure once the layout settles and hand the stylesheet a scale
     factor. It is 1 on every viewport the clamps already fit into, and only
     below that does it shrink the block enough to bring Clutch, Trustpilot
     and Google all on screen together.

     Measuring stays stable under its own output because --hero-fit drives a
     transform, and a transform does not change layout size — offsetHeight
     and the ResizeObserver both report the untransformed box. */
  useFitEffect(() => {
    const hero = heroRef.current;
    const inner = innerRef.current;
    if (!hero || !inner) return;

    const sync = () => {
      if (window.innerWidth >= 768) {
        hero.style.removeProperty("--hero-fit");
        return;
      }
      const styles = getComputedStyle(hero);
      const available =
        hero.clientHeight -
        parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom);
      const needed = inner.offsetHeight;
      // Floored at 0.6: on a viewport short enough to want less than that the
      // hero would be unreadable anyway, and a negative ratio — which a
      // viewport shorter than the hero's own padding produces — would flip
      // the whole block upside down.
      const fit =
        needed > 0 ? Math.min(1, Math.max(0.6, available / needed)) : 1;
      hero.style.setProperty("--hero-fit", String(Math.round(fit * 1000) / 1000));
    };

    sync();

    // The hero grows as webfonts swap in and the badge images decode, so
    // measure again whenever a box actually changes rather than once.
    const ro = new ResizeObserver(sync);
    ro.observe(hero);
    ro.observe(inner);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return (
    <section className="hero" aria-label="Introduction" ref={heroRef}>
      <HeroBackground />
      <div className="hero__inner" ref={innerRef} style={{ position: "relative", zIndex: 2 }}>
        <p className="hero__eyebrow">Digital Transformation Company</p>

        {/* The break is display:none above 768px, so it generates no box and
            the desktop headline is unchanged — it is a flex container there
            and any extra child would have become a flex item. Below 768px the
            headline switches to normal flow and this splits it the way the
            design does: "Empowering" over "Your Vision". */}
        <h1 className="hero__headline">
          {/* The space belongs to the text, not to the JSX newline — with the
              <br> display:none above 768px the two text nodes become one
              anonymous flex item, and without this it read "EmpoweringYour". */}
          Empowering{" "}
          <br className="hero__headline-br" />
          Your{" "}
          <span className="hero__headline-highlight hero__word">
            Vision
          </span>
        </h1>

        <div className="hero__subline">
          <p className="hero__subheading">Discuss. Design. Develop</p>

          {/* The intrinsic size, so the browser can reserve the box before the
              PNG decodes. .ai_annimation sets width: 75px and leaves height
              auto, so the rendered arrow is unchanged at 75x69 — these only
              supply the ratio, which is what the unsized-images audit and the
              hero fit pass both want. */}
          <img
            src="/assets/arrow.png"
            className="ai_annimation"
            alt="arrow"
            width={150}
            height={138}
          />

          <span className="hero__with">With</span>

          <span className="hero__ai-badge" aria-hidden="true">
            <span className="hero__ai-badge-inner">
              <svg className="hero__ai-sparkles-svg" viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Top-Left Deep Purple Star */}
                <path
                  className="ai-badge-star ai-badge-star--purple"
                  d="M16 4 C16.5 8 18.5 10 22.5 10.5 C18.5 11 16.5 13 16 17 C15.5 13 13.5 11 9.5 10.5 C13.5 10 15.5 8 16 4 Z"
                  fill="#7e22ce"
                />
                {/* 2. Bottom-Left Deep Pink/Magenta Star */}
                <path
                  className="ai-badge-star ai-badge-star--pink"
                  d="M16 26 C16.3 28.5 17.8 30 20.3 30.3 C17.8 30.6 16.3 32.1 16 34.6 C15.7 32.1 14.2 30.6 11.7 30.3 C14.2 30 15.7 28.5 16 26 Z"
                  fill="#be185d"
                />
                {/* 3. Deep Royal Blue Star (Right Side, Center-Aligned) */}
                <path
                  className="ai-badge-star ai-badge-star--blue"
                  d="M36 11 C36.7 17 39.7 20 45.7 20.7 C39.7 21.4 36.7 24.4 36 30.4 C35.3 24.4 32.3 21.4 26.3 20.7 C32.3 20 35.3 17 36 11 Z"
                  fill="#1e40af"
                />
              </svg>
              <span className="hero__ai-badge-text">Ai</span>
            </span>
          </span>
        </div>

        <div className="hero__reviews">
          {/* The intrinsic sizes are what let the browser reserve each badge's
              box before the PNG decodes. Without them the hero measures short
              on first paint and the fit pass below would have to correct
              itself once the images arrive. */}

          {/* Card 1: Clutch */}
          <div className="hero__review-card">
            <img
              src="/assets/clutch.webp"
              width={900}
              height={317}
              alt="Reviewed on Clutch 5.0 out of 5.0"
              className="hero__review-badge-img"
            />
          </div>

          {/* Card 2: Trustpilot */}
          <div className="hero__review-card">
            <img
              src="/assets/Trustpilot.webp"
              width={900}
              height={317}
              alt="Reviewed on Trustpilot 5.0 out of 5.0"
              className="hero__review-badge-img"
            />
          </div>

          {/* Card 3: Google */}
          <div className="hero__review-card">
            <img
              src="/assets/Google-reviews.webp"
              width={900}
              height={317}
              alt="Reviewed on Google 5.0 out of 5.0"
              className="hero__review-badge-img"
            />
          </div>
        </div>

        {/* Space placeholder for hero layout - single fixed search dock is pinned at bottom */}
        <div className="hero__search-placeholder" aria-hidden="true" />
      </div>
    </section>
  );
}
