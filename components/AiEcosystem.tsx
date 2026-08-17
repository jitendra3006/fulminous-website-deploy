"use client";

import React, { useEffect, useRef, useState } from "react";
import { live } from "@/lib/site-config";

/* "Fulminous AI" — the AI ecosystem band between the technology stack and
   the industries row.
   ------------------------------------------------------------------
   The left half was an orbit diagram: a core with six labelled chips going
   round it. It looked like every AI section on the internet and it said
   nothing — the six words could have been in any order and the picture
   would have been identical. This is the drawing an architect actually
   makes when a client asks what "an AI ecosystem" means: the four layers
   of the stack, bottom to top, each one named with what we build in it,
   and a signal travelling up the rail from data to the thing the user
   touches. The order carries the argument — you cannot have agents
   without models, or models without data — which is exactly the point the
   copy beside it is making.

   Frame it like a page out of a spec: a ruled panel, a small
   "reference architecture" eyebrow, and a footer saying where it runs.

   MOTION. Two layers, deliberately separate:

   • Idle — one pulse rides the rail bottom to top every 4.8s and each
     layer lights as it passes (its --lit-delay is its own position on the
     rail, so the light and the pulse are always on the same tick).
   • Entry — one choreography, played once when the band first scrolls
     into view; .is-in lands and the observer disconnects. Every element
     reads its offset from --in-delay, set inline.

   Entry animations use fill-mode `backwards`, not `both`: a filling
   animation outranks normal declarations, so `both` would pin the cards
   at their final transform and kill the hover states.

   DESKTOP ONLY for now, by request — display:none below 1024px until the
   responsive pass is signed off. */

const LAYERS = [
  { title: "Data Foundation" },
  { title: "Models" },
  { title: "Agents" },
  { title: "Experience" },
];

/* The fan. Seven wedges from the refraction point, spanning -18deg to +31deg
   — narrow enough that they overlap into a continuous spectrum rather than
   reading as seven separate triangles. The palette is weighted to the brand:
   it opens on the site's blues and lands on --color-accent, with the violet
   and pink only as the crossover between them. */
const SPECTRUM = [
  { color: "#7cd4ff", from: -18, to: -10 },
  { color: "#4f9bff", from: -11, to: -3 },
  { color: "#2f7ae5", from: -4, to: 4 },
  { color: "#8b7bff", from: 3, to: 11 },
  { color: "#e07be0", from: 10, to: 18 },
  { color: "#ff8f7a", from: 17, to: 25 },
  { color: "#f09d4d", from: 24, to: 32 },
];

/* Where the light leaves the glass. Every wedge, the hot core and the bloom
   are drawn from this one point, and the CSS rotates them about it too. */
const APEX = { x: 236, y: 196 };
const REACH = 460;

const wedge = (from: number, to: number) => {
  const edge = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    const x = (APEX.x + REACH * Math.cos(rad)).toFixed(1);
    const y = (APEX.y + REACH * Math.sin(rad)).toFixed(1);
    return `${x} ${y}`;
  };
  return `M${APEX.x} ${APEX.y} L${edge(from)} L${edge(to)} Z`;
};

/* Dust in the light. Hand-placed rather than random: Math.random() would give
   a different figure on the server and the client and React would complain,
   and a scatter that reads well is worth choosing anyway. */
const MOTES = [
  { cx: 300, cy: 120, r: 1.8, dur: 7, delay: 0 },
  { cx: 356, cy: 168, r: 1.3, dur: 9, delay: 1.2 },
  { cx: 402, cy: 232, r: 2, dur: 8, delay: 2.4 },
  { cx: 330, cy: 288, r: 1.4, dur: 10, delay: 0.6 },
  { cx: 268, cy: 330, r: 1.7, dur: 7.5, delay: 3 },
  { cx: 424, cy: 132, r: 1.2, dur: 11, delay: 1.8 },
  { cx: 152, cy: 96, r: 1.5, dur: 8.5, delay: 2.1 },
  { cx: 92, cy: 288, r: 1.3, dur: 9.5, delay: 0.9 },
];

const CAPABILITIES = [
  {
    title: "GenAI Integration",
    items: ["AI Agents", "Chatbots", "Coding Assistants"],
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="3" />
        <path d="M7.5 9.5 10 12l-2.5 2.5M12.5 14.5h4" />
      </>
    ),
  },
  {
    title: "Computer Vision",
    items: ["Quality Control", "Visual Inspection"],
    icon: (
      <>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Data Engineering",
    items: ["The infrastructure that feeds the AI"],
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
        <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
      </>
    ),
  },
];

/* Inline delay, typed. Every entry animation is keyed off --in-delay so the
   whole choreography is one number per element rather than a class per step. */
const delay = (seconds: number) => ({ "--in-delay": `${seconds}s` }) as React.CSSProperties;

export function AiEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  /* Fires once and then disconnects: the reveal is a long choreography, and
     replaying it every time the band scrolls back into view turns a piece of
     polish into a distraction. If the browser has no IntersectionObserver the
     section shows itself immediately rather than staying hidden. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ai-eco${isIn ? " is-in" : ""}`}
      aria-labelledby="ai-eco-title"
    >
      <div className="ai-eco__inner">
        <div className="ai-eco__stage">
          <p className="ai-eco__wordmark">
            <span className="ai-eco__wordmark-name">Fulminous</span>
            <span className="ai-eco__wordmark-ai">AI</span>
            <svg className="ai-eco__wordmark-spark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z" />
            </svg>
          </p>

          {/* Decorative: the caption and the strip under it carry the meaning
              in text, so the artwork itself is hidden from assistive tech. */}
          <figure className="ai-prism">
            <svg className="ai-prism__art" viewBox="0 0 480 400" aria-hidden="true">
              <defs>
                <linearGradient id="aiPrismBeam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="55%" stopColor="#dbe8fb" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="aiPrismGlass" x1="0" y1="0" x2="0.9" y2="1">
                  <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.34" />
                  <stop offset="52%" stopColor="#6ba0e8" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                </linearGradient>
                {/* One blur for the whole fan rather than one per wedge: the
                    filter region is the expensive part, and seven of them
                    overlapping cost seven times as much to composite. */}
                <filter id="aiPrismSoft" x="-20%" y="-40%" width="150%" height="200%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
                <filter id="aiPrismBloom" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="16" />
                </filter>
              </defs>

              {/* The beam arriving from off-frame, left. */}
              <path
                className="ai-prism__beam"
                d="M0 150 L172 184 L172 198 L0 164 Z"
                fill="url(#aiPrismBeam)"
              />

              {/* Two bright slugs riding the beam into the glass, on a loop.
                  They are the one piece of motion that never stops and never
                  loops back — light arriving, over and over. */}
              <g className="ai-prism__feed">
                <path className="ai-prism__slug" d="M0 150 L26 155 L26 169 L0 164 Z" fill="#ffffff" />
                <path
                  className="ai-prism__slug ai-prism__slug--late"
                  d="M0 150 L26 155 L26 169 L0 164 Z"
                  fill="#ffffff"
                />
              </g>

              <g className="ai-prism__fan" filter="url(#aiPrismSoft)">
                {SPECTRUM.map(({ color, from, to }, i) => (
                  <path
                    key={color}
                    className="ai-prism__wedge"
                    d={wedge(from, to)}
                    fill={color}
                    style={
                      {
                        "--flicker": `${(4.2 + i * 0.6).toFixed(1)}s`,
                        "--tilt": `${(i % 2 === 0 ? 1 : -1) * 2.4}deg`,
                        ...delay(0.55 + i * 0.07),
                      } as React.CSSProperties
                    }
                  />
                ))}

                {/* A pale wedge swung back and forth across the whole fan:
                    wherever it is, that part of the spectrum brightens. It
                    shares the fan's blur, so it reads as light moving through
                    the colours rather than a shape sliding over them. */}
                <path className="ai-prism__sweep" d={wedge(-5, 5)} fill="#ffffff" />
              </g>

              {/* The hot core of the refraction, over the colours. */}
              <path className="ai-prism__core" d={wedge(-2, 6)} fill="#ffffff" />
              <circle className="ai-prism__bloom" cx="236" cy="196" r="20" fill="#eaf2ff" filter="url(#aiPrismBloom)" />

              <path
                className="ai-prism__glass"
                d="M206 118 L264 246 L148 246 Z"
                fill="url(#aiPrismGlass)"
                stroke="rgba(219,232,251,0.55)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              <g className="ai-prism__motes">
                {MOTES.map(({ cx, cy, r, dur, delay: d }, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#dbe8fb"
                    style={{ "--drift": `${dur}s`, "--drift-delay": `${d}s` } as React.CSSProperties}
                  />
                ))}
              </g>
            </svg>

            <figcaption className="ai-prism__caption">
              One beam in. Every capability out.
            </figcaption>
          </figure>

          {/* The stack, kept as one line of text under the artwork: the order
              is the argument — agents need models, models need data. */}
          <ol className="ai-flow">
            {LAYERS.map(({ title }, i) => (
              <li className="ai-flow__step" key={title} style={delay(0.72 + i * 0.08)}>
                {title}
              </li>
            ))}
          </ol>
        </div>

        <div className="ai-eco__content">
          <h2 className="ai-eco__title" id="ai-eco-title">
            <span className="ai-eco__title-light" style={delay(0.1)}>
              Building AI Ecosystems
            </span>
            <span className="ai-eco__title-bold" style={delay(0.22)}>
              That Align With Your Organization
            </span>
          </h2>

          <p className="ai-eco__lead" style={delay(0.36)}>
            <strong>Fulminous AI</strong> is our dedicated centre of excellence, built to help
            enterprises navigate the AI revolution. From custom LLMs to automated workflows, we move
            your business beyond the hype into practical, revenue-generating AI implementation.
          </p>

          <div className="ai-eco__cards">
            {CAPABILITIES.map(({ title, items, icon }, i) => (
              <article className="ai-eco-card" key={title} style={delay(0.5 + i * 0.12)}>
                <span className="ai-eco-card__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icon}
                  </svg>
                </span>
                <h3 className="ai-eco-card__title">{title}</h3>
                <ul className="ai-eco-card__list">
                  {items.map((item) => (
                    <li key={item}>
                      <svg className="ai-eco-card__tick" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m3 13 4 4 8-9" />
                        <path d="m11 13 4 4 8-9" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="ai-eco__actions">
            {/* The advisory session is the contact form already on this page;
                the second link goes to the AI page on the live site, which is
                the same destination the Services menu uses. */}
            <a className="ai-eco__btn ai-eco__btn--primary" href="#contact" style={delay(0.86)}>
              Book Your AI Advisory Session
            </a>
            <a
              className="ai-eco__btn ai-eco__btn--ghost"
              href={live("/enterprise-ai-development-company")}
              target="_blank"
              rel="noopener noreferrer"
              style={delay(0.96)}
            >
              Discover Fulminous AI
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
