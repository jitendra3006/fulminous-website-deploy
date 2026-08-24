"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { live } from "@/lib/site-config";

/* "Fulminous AI" — Wizard Magical Staff Strike & Content Generation.
   ------------------------------------------------------------------
   - The wizard remains firmly planted and grounded on the floor (no jumping/bouncing).
   - Staff Action Sequence:
       1. Raise / Prepare magical staff with charging crystal plasma & electric arcs.
       2. Swing staff downward with power.
       3. Staff tip firmly hits the ground magic circle.
       4. Strong electric impact / thunderstorm shockwave explodes outward.
       5. Lightning streams out sequentially to generate the 6 Fulminous AI capabilities:
            1. AI Agents
            2. LLM Integration
            3. Conversational AI
            4. Process Automation
            5. Computer Vision
            6. Predictive Insights */

type Capability = {
  key: string;
  label: string;
  desc: string;
  angle: number;
  stepOrder: number;
  icon: React.ReactNode;
};

const CAPABILITIES: Capability[] = [
  {
    key: "agents",
    label: "AI Agents",
    desc: "Autonomous multi-agent workflows",
    angle: -90,
    stepOrder: 1,
    icon: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="4" />
        <path d="M12 7V4M9 13h.01M15 13h.01M10 16.5h4" />
      </>
    ),
  },
  {
    key: "llm",
    label: "LLM Integration",
    desc: "Custom models & fine-tuning",
    angle: -145,
    stepOrder: 2,
    icon: (
      <>
        <path d="M12 3.5 19 7v10l-7 3.5L5 17V7Z" />
        <path d="M12 10.5 15.5 12v3.5" />
        <circle cx="12" cy="9" r="1.6" />
      </>
    ),
  },
  {
    key: "conversational",
    label: "Conversational AI",
    desc: "Context-aware intelligent assistants",
    angle: -35,
    stepOrder: 3,
    icon: (
      <>
        <path d="M20 12a8 8 0 0 1-8 8H7l-3 2 1-4.5A8 8 0 1 1 20 12Z" />
        <path d="M8.5 11.5h7M8.5 15h4" />
      </>
    ),
  },
  {
    key: "automation",
    label: "Process Automation",
    desc: "End-to-end cognitive orchestration",
    angle: 35,
    stepOrder: 4,
    icon: (
      <>
        <path d="M4 8h9a4 4 0 0 1 0 8H7" />
        <path d="M9.5 4.5 13 8l-3.5 3.5M9.5 12.5 6 16l3.5 3.5" />
      </>
    ),
  },
  {
    key: "vision",
    label: "Computer Vision",
    desc: "Real-time recognition & spatial AI",
    angle: 145,
    stepOrder: 5,
    icon: (
      <>
        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
  },
  {
    key: "predictive",
    label: "Predictive Insights",
    desc: "Data-driven forecasting & analytics",
    angle: 90,
    stepOrder: 6,
    icon: (
      <>
        <path d="M4 19h16" />
        <path d="M5 15.5 10 10l3.5 3L19 6" />
        <path d="M19 10V6h-4" />
      </>
    ),
  },
];

/* Splits a string into word spans so the copy can be "generated" by the
   staff strike — one fast burst, each word snapping in a few ms after the
   last rather than a slow typewriter crawl. */
function genWords(text: string, extraClass?: string) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span
      key={`${i}-${word}`}
      className={`fai__gen-word${extraClass ? ` ${extraClass}` : ""}`}
      style={{ "--gi": i } as React.CSSProperties}
    >
      {word}
      {i < words.length - 1 ? " " : ""}
    </span>
  ));
}

/* The wordmark is split per character so each letter can be struck in
   individually — a word-level stagger is too coarse to read as electric. */
function genChars(text: string) {
  return Array.from(text).map((ch, i) => (
    <span
      key={i}
      className="fai__gen-char"
      style={{ "--gi": i } as React.CSSProperties}
      aria-hidden="true"
    >
      {ch === " " ? " " : ch}
    </span>
  ));
}

const FAI_LEAD =
  "A single AI core that plugs into the systems your teams already run — agents, automation, and prediction working from the same data, not six disconnected pilots.";

/* How long the bolt takes to travel the navbar logo -> staff crystal. The
   wizard's charge only begins once it lands. */
const BOLT_TRAVEL_MS = 460;

/* Fixed perpendicular offsets rather than Math.random() — the shape stays
   identical between casts, so the bolt reads as the same conduit each time. */
const BOLT_JITTER = [0, 16, -22, 12, -26, 18, -10, 6, 0];

function boltPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  /* Unit vector perpendicular to the run, so the zigzag is always square to
     the bolt's direction no matter where the logo sits on screen. */
  const nx = -dy / len;
  const ny = dx / len;

  return BOLT_JITTER.map((offset, i) => {
    const t = i / (BOLT_JITTER.length - 1);
    const px = x1 + dx * t + nx * offset;
    const py = y1 + dy * t + ny * offset;
    return `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(" ");
}

type Bolt = { d: string; tipX: number; tipY: number; length: number };

const LIGHTNING_MOTES = [
  { x: 14, y: 22, d: 11, delay: 0 },
  { x: 84, y: 16, d: 14, delay: 1.6 },
  { x: 92, y: 66, d: 13, delay: 0.6 },
  { x: 70, y: 86, d: 16, delay: 2.4 },
  { x: 18, y: 80, d: 12, delay: 0.3 },
  { x: 8, y: 46, d: 15, delay: 2.8 },
  { x: 46, y: 10, d: 14, delay: 1.2 },
  { x: 56, y: 90, d: 17, delay: 2.0 },
];

export function FulminousAi() {
  const sectionRef = useRef<HTMLElement>(null);
  const crystalRef = useRef<HTMLDivElement>(null);
  const wizardBoxRef = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isStriking, setIsStriking] = useState(false);
  const [castKey, setCastKey] = useState(0);
  /* The bolt out of the navbar logo is beat one; `isCasting` is beat two and
     gates every wizard/capability animation, so the whole sequence simply
     starts later instead of every delay needing a hard-coded offset. */
  const [bolt, setBolt] = useState<Bolt | null>(null);
  const [isCasting, setIsCasting] = useState(false);

  /* Starts true so the first arrival counts as an entry. */
  const hasLeft = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /* Both endpoints are read fresh every time. The header is fixed and the
     staff is not, so the gap between them changes on every scrolled pixel —
     a path measured once would leave the bolt hanging in mid-air. */
  const measureBolt = useCallback((): Bolt | null => {
    const logo = document.querySelector<HTMLElement>(".site-header__logo");
    const crystal = crystalRef.current;
    if (!logo || !crystal) return null;

    const a = logo.getBoundingClientRect();
    const b = crystal.getBoundingClientRect();
    const x1 = a.left + a.width / 2;
    const y1 = a.top + a.height / 2;
    const x2 = b.left + b.width / 2;
    const y2 = b.top + b.height / 2;

    return {
      d: boltPath(x1, y1, x2, y2),
      tipX: x2,
      tipY: y2,
      /* Overshoots the straight-line distance to cover the zigzag, so the
         dash reveal never stops short of the staff. */
      length: Math.hypot(x2 - x1, y2 - y1) * 1.35,
    };
  }, []);

  const runCast = useCallback(() => {
    clearTimers();
    setBolt(measureBolt());

    /* Reset first so re-casting restarts the CSS animations from frame 0 —
       toggling the class off and on again is what rewinds them. */
    setIsCasting(false);
    setIsStriking(false);
    setCastKey((prev) => prev + 1);

    timers.current.push(
      setTimeout(() => {
        setIsCasting(true);
        setIsStriking(true);
      }, BOLT_TRAVEL_MS),
      setTimeout(() => setBolt(null), BOLT_TRAVEL_MS + 500),
      setTimeout(() => setIsStriking(false), BOLT_TRAVEL_MS + 3900)
    );
  }, [clearTimers, measureBolt]);

  /* Keep the bolt welded to the staff while it is on screen. The cast is
     usually triggered mid-scroll, so the staff is still moving under it —
     without this the bolt lands wherever the staff was when the section
     first crossed the threshold. */
  const isBoltLive = bolt !== null;

  useEffect(() => {
    if (!isBoltLive) return;

    let raf = 0;
    const track = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = measureBolt();
        if (!next) return;
        /* Only the geometry is re-tracked. `length` feeds stroke-dasharray,
           which the travel animation interpolates from — rewriting it
           mid-flight would visibly jump the bolt's length, so it only ever
           grows, and only enough to keep covering the widening gap. */
        setBolt((prev) =>
          prev ? { ...next, length: Math.max(prev.length, next.length) } : next
        );
      });
    };

    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
    };
  }, [isBoltLive, measureBolt]);

  /* Section-level: drives the ambient/orbit animations only. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsIn(true);
      setIsLive(true);
      runCast();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setIsLive(entry.isIntersecting),
      { threshold: 0.18 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [runCast]);

  /* Cast trigger watches the wizard, not the section: the bolt has to have
     something to land on. The section can be 18% on screen while the staff
     is still below the fold, which is how the bolt ended up striking empty
     space. The negative top margin keeps the fixed header's own band from
     counting as visible.

     It observes the image box rather than the crystal itself because the
     crystal rides the wind-up animation — a moving target crossed back and
     forth over the threshold mid-cast, re-arming the latch and firing a
     second bolt. The box does not move. */
  useEffect(() => {
    const target = wizardBoxRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Replay on every arrival, not just the first — scrolling back to
             the section should look the same as loading straight onto it.
             The latch is what stops it re-firing on every observer tick
             while the wizard simply stays in view. */
          if (hasLeft.current) {
            hasLeft.current = false;
            setIsIn(true);
            runCast();
          }
        } else {
          hasLeft.current = true;
        }
      },
      { threshold: 0.95, rootMargin: "-110px 0px -20px 0px" }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [runCast]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <section
      ref={sectionRef}
      className={`fai fai--wizard-interactive${isIn ? " is-in" : ""}${isLive ? " is-live" : ""}${isCasting ? " is-casting" : ""}${isStriking ? " is-striking" : ""}`}
      aria-labelledby="fai-title"
    >
      {/* Background ambient lighting washes */}
      <div className="fai__wash" aria-hidden="true" />

      {/* Atmospheric lightning discharge flash */}
      <div className="fai__thunder-flash" aria-hidden="true" />

      {/* BEAT ONE: a bolt cracks out of the navbar logo and hits the staff.
          Fixed-positioned because the header is fixed and the staff is not —
          viewport coordinates are the only frame both share. */}
      {bolt && (
        <svg
          className="fai__origin-bolt"
          key={`bolt-${castKey}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fai__origin-bolt-glow"
            d={bolt.d}
            style={{ "--bolt-len": bolt.length } as React.CSSProperties}
          />
          <path
            className="fai__origin-bolt-core"
            d={bolt.d}
            style={{ "--bolt-len": bolt.length } as React.CSSProperties}
          />
          <circle className="fai__origin-bolt-hit" cx={bolt.tipX} cy={bolt.tipY} r="10" />
        </svg>
      )}

      <div className="fai__inner">
        {/* LEFT COLUMN: Integrated AI Wizard Spell-Casting Energy Stage.
            Anywhere on the stage is a cast target — interacting with the
            interface is what makes the wizard slam the staff down. */}
        <div
          className="fai__wizard-stage"
          onClick={runCast}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && runCast()}
          role="button"
          tabIndex={0}
          aria-label="Strike the wizard staff to generate the AI capabilities"
        >
          {/* Floor strike shockwave origin (rings removed — clean stage) */}
          <div className="fai__floor-runic-circle" aria-hidden="true">
            <span className="fai__shockwave-pulse" />
          </div>

          {/* Drifting plasma & lightning sparks */}
          <div className="fai__motes" aria-hidden="true">
            {LIGHTNING_MOTES.map((m, i) => (
              <span
                key={i}
                className="fai__mote fai__mote--spark"
                style={
                  {
                    "--mx": `${m.x}%`,
                    "--my": `${m.y}%`,
                    "--md": `${m.d}s`,
                    "--mdelay": `${m.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Branching lightning energy rails from Floor center to each node */}
          <div className="fai__lightning-rails" aria-hidden="true">
            {CAPABILITIES.map(({ key, angle, stepOrder }) => {
              const isActive = activeNode === key;
              return (
                <div
                  key={key}
                  className={`fai__lightning-rail fai__rail--${stepOrder}${isActive ? " is-active" : ""}`}
                  style={
                    {
                      "--a": `${angle}deg`,
                      /* Impact lands at 1560ms — nothing shoots out before it. */
                      "--delay": `${1720 + (stepOrder - 1) * 200}ms`,
                    } as React.CSSProperties
                  }
                >
                  <svg className="fai__lightning-svg" viewBox="0 0 260 24" preserveAspectRatio="none">
                    <path
                      d="M0 12 Q35 4 70 15 T140 7 T200 17 T260 12"
                      fill="none"
                      stroke="url(#fai-wizard-lightning-grad)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="fai__lightning-spark" />
                </div>
              );
            })}

            {/* Shared lightning gradient defs */}
            <svg width="0" height="0" className="fai__hidden-defs" aria-hidden="true">
              <defs>
                <linearGradient id="fai-wizard-lightning-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Centerpiece Wizard Character (Grounded & Planted on Floor) */}
          <div className="fai__wizard-character" title="Click to strike the Staff on the floor">
            {/* Ground Impact Flash Flare at Staff Tip Contact Point */}
            <div className="fai__ground-impact" aria-hidden="true">
              <div className="fai__impact-glow" />
              <div className="fai__impact-bolt-core">
                <svg viewBox="0 0 32 32" className="fai__impact-bolt" aria-hidden="true">
                  <path
                    d="M18.4 4.5 9 17.5 16 17.5 13.6 27.5 23 14.5 16 14.5Z"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
            </div>

            {/* Planted Wizard Character Box */}
            <div className="fai__wizard-img-box" ref={wizardBoxRef}>
              {/* Animated Staff Action Layer (Raise -> Swing Down -> Strike) */}
              <div className="fai__staff-action-layer" aria-hidden="true">
                <div className="fai__staff-crystal-energy" ref={crystalRef}>
                  <span className="fai__crystal-plasma" />
                  <span className="fai__crystal-spark fai__crystal-spark--1" />
                  <span className="fai__crystal-spark fai__crystal-spark--2" />
                  <span className="fai__staff-lightning-arc" />
                </div>
              </div>

              {/* Pose A — ready stance, held while the lightning charges */}
              <Image
                src="/assets/wizard-character-pure.png"
                alt="Fulminous AI Wizard standing ready with his charged magical staff"
                width={420}
                height={500}
                className="fai__wizard-img fai__wizard-img--ready"
                priority
              />

              {/* Pose B — hard-cut to on the frame the staff hits the ground */}
              <Image
                src="/assets/wizard-strike-pose.png"
                alt=""
                aria-hidden="true"
                width={606}
                height={648}
                className="fai__wizard-img fai__wizard-img--strike"
                priority
              />

              <div className="fai__wizard-glow-aura" aria-hidden="true" />
            </div>
          </div>

          {/* 6 AI Capabilities — Initially Hidden, Generated Sequentially AFTER floor strike */}
          <ul className="fai__capabilities">
            {CAPABILITIES.map(({ key, label, desc, angle, stepOrder, icon }) => (
              <li
                key={key}
                className={`fai__capability-node fai__node--step-${stepOrder}${activeNode === key ? " is-focused" : ""}`}
                style={
                  {
                    "--a": `${angle}deg`,
                    "--step": stepOrder,
                    /* Each card rides in 130ms behind its own lightning rail. */
                    "--delay": `${1850 + (stepOrder - 1) * 200}ms`,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setActiveNode(key)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="fai__capability-card">
                  <span className="fai__capability-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {icon}
                    </svg>
                  </span>
                  <div className="fai__capability-meta">
                    <span className="fai__capability-title">{label}</span>
                    <span className="fai__capability-desc">{desc}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN: Branded Content & CTA.
            Re-keyed on every cast so the copy re-generates with each staff strike. */}
        <div className="fai__content">
          <div className="fai__badge">
            <span className="fai__badge-text" role="text" aria-label="Fulminous AI">
              {genChars("FULMINOUS AI")}
            </span>
          </div>

          <h2 className="fai__title" id="fai-title">
            <span className="fai__title-line">{genWords("One intelligence layer,")}</span>
            <span className="fai__title-line fai__title-accent">
              {genWords("wired through your business.", "fai__gen-word--accent")}
            </span>
          </h2>

          <p className="fai__lead">{genWords(FAI_LEAD)}</p>

          <div className="fai__actions">
            <a
              className="fai__btn"
              href={live("/enterprise-ai-development-company")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Explore Fulminous AI</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <button
              type="button"
              className="fai__cast-btn"
              onClick={runCast}
              aria-label="Strike wizard staff to generate AI capabilities"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
              </svg>
              <span>Strike Staff</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
