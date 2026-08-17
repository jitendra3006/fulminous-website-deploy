import React from "react";

/**
 * The one sprite symbol the page actually uses.
 *
 * This file used to define 33 symbols — industry graphics and a full set of
 * technology logos — inlined into the <body> of every route by the layout. An
 * exhaustive search for `#icon-*` / `#logo-*` across components, styles, hooks
 * and lib (including the HTML that Domains builds as strings, and `url(#…)` in
 * CSS) finds references to exactly two ids: `icon-star`, used 25 times by the
 * rating rows, and `icon-arrow-right`, which was never defined here in the
 * first place and so has always painted nothing.
 *
 * The other 32 were ~14kB of markup and ~140 DOM nodes shipped on every page
 * load for nothing — parsed, styled and laid out by the browser before it could
 * get to the hero. They are removed, not commented out; git has them if a
 * section ever wants them back, and re-adding one is a `<symbol>` and a path.
 *
 * `icon-arrow-right` is deliberately still undefined: defining it now would
 * make an arrow appear beside "Read More" in Cases and TechPartnerIntro, which
 * is a visual change, not an optimisation.
 */
export function SvgSymbols() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <symbol id="icon-star" viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01z" />
      </symbol>
    </svg>
  );
}
