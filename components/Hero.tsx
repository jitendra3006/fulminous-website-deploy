"use client";

import React from "react";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <HeroBackground />
      <div className="hero__inner" style={{ position: "relative", zIndex: 2 }}>
        <p className="hero__eyebrow">Digital Transformation Company</p>

        <h1 className="hero__headline">
          Empowering Your{" "}
          <span className="hero__headline-highlight hero__word">
            Vision
          </span>
        </h1>

        <div className="hero__subline">
          <p className="hero__subheading">Discuss. Design. Develop</p>

          <img src="/assets/arrow.png" className="ai_annimation" alt="arrow" />

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
          {/* Card 1: Clutch */}
          <div className="hero__review-card">
            <img
              src="/assets/clutch.png"
              alt="Reviewed on Clutch 5.0 50 Reviews"
              className="hero__review-badge-img"
            />
          </div>

          {/* Card 2: Trustpilot */}
          <div className="hero__review-card">
            <img
              src="/assets/Trustpilot.png"
              alt="Trustpilot 5.0 50 Reviews"
              className="hero__review-badge-img"
            />
          </div>

          {/* Card 3: Google */}
          <div className="hero__review-card">
            <img
              src="/assets/Google-reviews.png"
              alt="Google 5.0 50 Reviews"
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
