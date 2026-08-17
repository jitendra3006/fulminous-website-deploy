"use client";

import React, { useState, useEffect, useRef } from "react";

export function ScrollGenerativeText({
  text,
  speed = 25,
  delay = 100,
  className = "",
  tag = "h2",
  id,
}: {
  text: string;
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

function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic formula for a smooth, premium slowdown as it reaches target number
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, target, duration]);

  return <span ref={elRef}>{count}</span>;
}

export function TechPartnerIntro() {
  return (
    <div className="intro">
      <div className="section-head">
        <ScrollGenerativeText
          text="The Best Global Technology Partner: Empowering Businesses with Future-Ready Digital Solutions."
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
          <AnimatedCounter target={50} duration={1600} /><span className="stat__plus">+</span>
        </p>
        <p className="stat__label">Team Members</p>
      </div>
      <div className="stat stat--dark">
        <p className="stat__number">
          <AnimatedCounter target={190} duration={1800} /><span className="stat__plus">+</span>
        </p>
        <p className="stat__label">Projects Delivered</p>
      </div>
      <div className="stat stat--light">
        <p className="stat__number">
          <AnimatedCounter target={45} duration={1500} /><span className="stat__plus">+</span>
        </p>
        <p className="stat__label">Apps Developed</p>
      </div>
      <div className="stat stat--dark">
        <p className="stat__number">
          <AnimatedCounter target={130} duration={1700} /><span className="stat__plus">+</span>
        </p>
        <p className="stat__label">Happy Clients</p>
      </div>
    </div>
  );
}
