"use client";

import React, { useState, useEffect, useRef } from "react";

function GenerativeText({
  text,
  speed = 35,
  delay = 200,
  className = "",
  tag = "h2",
  id,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  tag?: "h2" | "p";
  id?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsStarted(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isStarted, text, speed]);

  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.bottom < windowHeight * 0.4) {
          const fadeRatio = Math.max(0.25, rect.bottom / (windowHeight * 0.4));
          setFadeOpacity((prev) => (Math.abs(prev - fadeRatio) > 0.02 ? fadeRatio : prev));
        } else {
          setFadeOpacity((prev) => (prev !== 1 ? 1 : prev));
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Component = tag;

  return (
    <div
      ref={containerRef}
      className="generative-text-wrap"
      style={{
        opacity: fadeOpacity,
        transform: `translateY(${(1 - fadeOpacity) * -12}px)`,
        transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
      }}
    >
      <Component className={`${className} ${isStarted ? "is-generating" : ""}`} id={id}>
        {displayedText}
        {displayedText.length < text.length && (
          <span className="generative-caret" aria-hidden="true">
            |
          </span>
        )}
        <span style={{ opacity: 0, pointerEvents: "none", userSelect: "none" }}>
          {text.slice(displayedText.length)}
        </span>
      </Component>
    </div>
  );
}

export function Industries() {
  return (
    <>
      <section className="industries" aria-labelledby="industries-title">
        <div className="industries__inner">
          <div className="industries__row industries__row--top">
            <div className="industries__intro">
              <GenerativeText
                text="Onboard Industry Expert Engineers"
                speed={30}
                delay={100}
                className="industries__title"
                id="industries-title"
                tag="h2"
              />
              <GenerativeText
                text="We offer you the support of a professional team for bringing ideas to life."
                speed={20}
                delay={800}
                className="industries__text"
                tag="p"
              />
            </div>

            <div className="industries__cards">
              <article className="industry-card">
                <div className="industry-card__icon-wrap">
                  <img className="industry-card__icon" src="/assets/icons/HealthCare.svg" alt="HealthCare" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                </div>
                <div className="industry-card__text">
                  <h3 className="industry-card__title">HealthCare</h3>
                  <p className="industry-card__desc">
                    We offer you the support of a professional team for bringing ideas to life.
                  </p>
                </div>
              </article>

              <article className="industry-card">
                <div className="industry-card__icon-wrap">
                  <img className="industry-card__icon" src="/assets/icons/Banking & Finance.svg" alt="Banking & Finance" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                </div>
                <div className="industry-card__text">
                  <h3 className="industry-card__title">Banking &amp; Finance</h3>
                  <p className="industry-card__desc">
                    Grow Your Financial Business with Our Financial Software Development Services
                  </p>
                </div>
              </article>

              <article className="industry-card">
                <div className="industry-card__icon-wrap">
                  <img className="industry-card__icon" src="/assets/icons/Real-Estate.svg" alt="Real Estate" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                </div>
                <div className="industry-card__text">
                  <h3 className="industry-card__title">Real Estate</h3>
                  <p className="industry-card__desc">
                    The Best Custom Real Estate Web-App Development Company
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="industries__row industries__grid">
            <article className="industry-card">
              <div className="industry-card__icon-wrap">
                <img className="industry-card__icon" src="/assets/icons/Travel & Hospitality.svg" alt="Travel & Hospitality" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              </div>
              <div className="industry-card__text">
                <h3 className="industry-card__title">Travel &amp; Hospitality</h3>
                <p className="industry-card__desc">
                  The worldwide hospitality market is expected to increase at a remarkable pace to
                </p>
              </div>
            </article>

            <article className="industry-card">
              <div className="industry-card__icon-wrap">
                <img className="industry-card__icon" src="/assets/icons/Media & Entertainment.svg" alt="Media & Entertainment" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              </div>
              <div className="industry-card__text">
                <h3 className="industry-card__title">Media &amp; Entertainment</h3>
                <p className="industry-card__desc">
                  Trending Software Solutions for the Media &amp; Entertainment Industry
                </p>
              </div>
            </article>

            <article className="industry-card">
              <div className="industry-card__icon-wrap">
                <img className="industry-card__icon" src="/assets/icons/E-commerce & Retail.svg" alt="E-commerce & Retail" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              </div>
              <div className="industry-card__text">
                <h3 className="industry-card__title">E-commerce &amp; Retail</h3>
                <p className="industry-card__desc">
                  A new era in the world economy has begun with the entry of e-commerce.
                </p>
              </div>
            </article>

            <article className="industry-card">
              <div className="industry-card__icon-wrap">
                <img className="industry-card__icon" src="/assets/icons/Education & e-Learning.svg" alt="Education & e-Learning" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              </div>
              <div className="industry-card__text">
                <h3 className="industry-card__title">Education &amp; e-Learning</h3>
                <p className="industry-card__desc">
                  Technology is the driving force of the current Education and eLearning industry.
                </p>
              </div>
            </article>

            <article className="industry-card">
              <div className="industry-card__icon-wrap">
                <img className="industry-card__icon" src="/assets/icons/Food & Restaurant.svg" alt="Food & Restaurant" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              </div>
              <div className="industry-card__text">
                <h3 className="industry-card__title">Food &amp; Restaurant</h3>
                <p className="industry-card__desc">
                  The Best Custom Real Estate Web-App Development Company
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-quote" aria-labelledby="cta-quote-title">
        <div className="cta-quote__inner">
          <div className="cta-quote__heading">
            <h2 className="cta-quote__title" id="cta-quote-title">
              Ready to Start Your Project?
            </h2>
            <p className="cta-quote__subtitle">Let's Create Something Amazing</p>
          </div>
          <div className="cta-quote__form">
            <input
              className="cta-quote__input"
              type="email"
              placeholder="Enter your email..."
              aria-label="Enter your email"
            />
            <button className="cta-quote__btn" type="button">
              Book a Free Strategy Call
            </button>
          </div>
          <p className="cta-quote__note">
            Our team is ready to help you achieve your marketing goals
            <br />
            with tailored solutions that drive results.
          </p>
        </div>
      </section>

      <section className="reviews-bar" aria-label="Client ratings">
        <div className="reviews-bar__inner">
          <div className="reviews-bar__card">
            <div className="review-stat">
              <img
                className="review-stat__logo"
                src="/assets/upwork.png"
                alt="GoodFirms rating"
                width={347}
                height={68}
              />
            </div>

            <div className="review-stat review-stat--blue">
              <div className="trustpilot-card-inner">
                <div className="trustpilot-card-head">
                  <svg className="trustpilot-star-svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                    <path fill="#00b67a" d="M12 0l3.6 7.4L24 8.5l-6 5.8 1.4 8.3L12 18.7l-7.4 3.9L6 14.3 0 8.5l8.4-1.1L12 0z" />
                  </svg>
                  <span className="trustpilot-card-title">Trustpilot</span>
                </div>
                <div className="trustpilot-card-score">
                  <div className="stars" role="img" aria-label="Rated 5 out of 5 stars">
                    <svg className="stars__icon" style={{ fill: "#f09d4d" }}>
                      <use href="#icon-star" />
                    </svg>
                    <svg className="stars__icon" style={{ fill: "#f09d4d" }}>
                      <use href="#icon-star" />
                    </svg>
                    <svg className="stars__icon" style={{ fill: "#f09d4d" }}>
                      <use href="#icon-star" />
                    </svg>
                    <svg className="stars__icon" style={{ fill: "#f09d4d" }}>
                      <use href="#icon-star" />
                    </svg>
                    <svg className="stars__icon" style={{ fill: "#f09d4d" }}>
                      <use href="#icon-star" />
                    </svg>
                  </div>
                  <span className="trustpilot-card-text">5.0, 50 Review</span>
                </div>
              </div>
            </div>

            <div className="review-stat">
              <img
                className="review-stat__logo"
                src="/assets/GoodFirms.png"
                alt="Clutch rating"
                width={253}
                height={39}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
