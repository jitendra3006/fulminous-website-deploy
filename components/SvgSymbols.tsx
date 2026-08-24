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
 * `icon-arrow-right` is now defined, on request. Cases and TechPartnerIntro
 * both already referenced it and both already style it — .case-link svg and
 * .intro-card__link svg set the stroke, width and the slide-on-hover — so the
 * arrow beside "Read More" had markup, styling and a hover state and was
 * painting nothing simply because no symbol backed the id. The path carries no
 * stroke or fill of its own for that reason: the two call sites colour it from
 * their own rules, which is what lets it turn blue on hover and inherit each
 * context's size (24px in Cases, 20px in the intro card).
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
      <symbol id="icon-arrow-right" viewBox="0 0 24 24">
        <path d="M5 12h13M12 5l7 7-7 7" />
      </symbol>
    </svg>
  );
}
