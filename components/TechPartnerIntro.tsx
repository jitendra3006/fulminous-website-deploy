"use client";

import React, { useEffect, useRef } from "react";

export function ScrollGenerativeText({
  text,
  speed = 25,
  delay = 100,
  className = "",
  tag = "h2",
  id,
}: {
  /* A node, not just a string, so a heading can carry its own line break
     where the design puts one. The three other call sites still pass plain
     strings. */
  text: React.ReactNode;
  speed?: number;
  delay?: number;
  className?: string;
  tag?: "h2" | "p" | "h3";
  id?: string;
}) {
  const Component = tag;

  return (
    <div className="scroll-generative-wrap">
      <Component className={className} id={id}>
        {text}
      </Component>
    </div>
  );
}

function AnimatedCounter({
  target,
  duration = 1600,
  suffix,
}: {
  target: number;
  duration?: number;
  suffix?: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const value = valueRef.current;
    if (!wrap || !value) return;

    /* Anyone who has asked for less motion gets the number, not the count. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      value.textContent = String(target);
      return;
    }

    /* The markup ships the target so the number is real content without
       javascript. Once we are going to animate it, reset to zero here — the
       stats sit well below the fold, so this happens long before they are
       looked at, and it avoids the final number showing and then snapping
       back to 0 as the section scrolls in. */
    value.textContent = "0";

    let frame = 0;
    let startedAt = 0;
    let shown = 0;

    const step = (t: number) => {
      if (!startedAt) startedAt = t;
      const progress = Math.min((t - startedAt) / duration, 1);
      /* Ease-out cubic, the same curve as before. */
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = progress < 1 ? Math.floor(eased * target) : target;
      /* Only touch the DOM when the integer actually changes: at 120Hz most
         frames land on the same number. */
      if (next !== shown) {
        shown = next;
        value.textContent = String(next);
      }
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        /* The last entry, not the first. A callback can carry several entries
           for one element after a fast scroll, and reading entries[0] meant a
           stale "left the viewport" could land after the element had settled
           in view - resetting the number to 0 with no later notification to
           put it right. Measured: the third stat sat at 0 while fully on
           screen under a 6x cpu throttle. */
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          cancelAnimationFrame(frame);
          startedAt = 0;
          shown = -1;
          frame = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(frame);
          shown = 0;
          value.textContent = "0";
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(wrap);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  /* The hidden copy sizes the box to the final value in the real font, and the
     live one is laid over it, so a digit appearing cannot move anything.
     The server renders the target too, which is the honest value to have in
     the markup and means no shift when hydration takes over.

     The suffix (the "+") goes inside both layers rather than staying a sibling
     of the counter, and that is what keeps the number centred. The reserved box
     is the width of the whole finished string, so the live layer can centre its
     own content inside it: "84" on the way to "190" sits in the middle of the
     card instead of hugging the right edge of a box held open for one more
     digit. The finished state is unchanged - at the target the live content
     fills the reserve exactly. */
  return (
    <span className="counter" ref={wrapRef}>
      <span className="counter__reserve" aria-hidden="true">
        {target}
        {suffix}
      </span>
      <span className="counter__live">
        <span className="counter__value" ref={valueRef}>
          {target}
        </span>
        {suffix}
      </span>
    </span>
  );
}

export function TechPartnerIntro() {
  return (
    <div className="intro">
      <div className="section-head">
        <ScrollGenerativeText
          text={
            <>
              The Best Global Technology Partner:{" "}
              {/* The Figma breaks here. The span is inline until 1240px, so
                  this is one sentence to a screen reader and to selection
                  either way. */}
              <span className="section-head__title-break">
                Empowering Businesses with Future-Ready Digital Solutions.
              </span>
            </>
          }
          speed={22}
          delay={100}
          className="section-head__title"
          id="tech-partner-title"
          tag="h2"
        />
        <ScrollGenerativeText
          text="Fulminous Software delivers the best-quality, advanced software solutions that fit all your business ideas and drive maximum growth."
          speed={18}
          delay={1400}
          className="section-head__text"
          tag="p"
        />
      </div>

      <div className="intro-cards">
        <article className="intro-card intro-card--growth">
          <div className="intro-card__panel">
            <p className="intro-card__eyebrow">Tech-Powered Growth</p>
            <h3 className="intro-card__title">
              Driving Digital Success Together: <span>Innovate, Transform, Succeed</span>
            </h3>
            {/* Was href="#". The card's claim — "Driving Digital Success
                Together" — has no page behind it here, so this is a <span>
                with the same class rather than an invented URL.
                .intro-card__link styles it outright and the hover animation
                is driven by .intro-card--growth:hover, which is unaffected. */}
            <span className="intro-card__link">
              Read More
              <svg aria-hidden="true">
                <use href="#icon-arrow-right" />
              </svg>
            </span>
          </div>
        </article>

        <article className="intro-card intro-card--about" id="who-we-are">
          <h3 className="intro-card__label">Who We Are</h3>
          <p className="intro-card__para">
            Fulminous Software is one of the top-rated software development companies that covers
            service areas of software, website, mobile application development, and many more
            technology solutions.
          </p>
          <p className="intro-card__para">
            Started from India, we are now serving clients across the USA, UK, Australia, Canada,
            UAE, and beyond. With a visionary goal, the company was founded in 2018, and since then,
            we have successfully delivered 135+ projects in various industries with 95% client
            satisfaction.
          </p>
        </article>

        <article className="intro-card intro-card--values">
          <div className="values-top">
            <h3 className="values-top__title">Our Core Values</h3>
            <p className="values-top__text">
              We Offer Custom Software Solutions for Every Need
            </p>
          </div>
          <div className="values-list">
            <ul>
              <li>Innovation</li>
              <li>Client-Centric</li>
              <li>Integrity</li>
            </ul>
            <ul>
              <li>Excellence</li>
              <li>Teamwork</li>
              <li>Accountability</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}

export function TechPartnerStats() {
  return (
    <div className="stats">
      <div className="stat stat--light">
        <p className="stat__number">
          <AnimatedCounter
            target={50}
            duration={1600}
            suffix={<span className="stat__plus">+</span>}
          />
        </p>
        <p className="stat__label">Team Members</p>
      </div>
      <div className="stat stat--dark">
        <p className="stat__number">
          <AnimatedCounter
            target={190}
            duration={1800}
            suffix={<span className="stat__plus">+</span>}
          />
        </p>
        <p className="stat__label">Projects Delivered</p>
      </div>
      <div className="stat stat--light">
        <p className="stat__number">
          <AnimatedCounter
            target={45}
            duration={1500}
            suffix={<span className="stat__plus">+</span>}
          />
        </p>
        <p className="stat__label">Apps Developed</p>
      </div>
      <div className="stat stat--dark">
        <p className="stat__number">
          <AnimatedCounter
            target={130}
            duration={1700}
            suffix={<span className="stat__plus">+</span>}
          />
        </p>
        <p className="stat__label">Happy Clients</p>
      </div>
    </div>
  );
}
