/* No "use client".
   ------------------------------------------------------------------
   Nothing in this file is interactive: GenerativeText below renders its
   `text` straight out — the `speed` and `delay` props are vestigial, from
   when it typed the string on a timer — and there is no state, no effect and
   no handler anywhere in the section. The directive was still here, along
   with an import of useState/useEffect/useRef that was never called, which
   put the whole section in the client bundle and made React hydrate every
   node of it for no behaviour.
   The markup it renders is identical either way. */

import React from "react";

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
  const Component = tag;

  return (
    <div className="generative-text-wrap">
      <Component className={className} id={id}>
        {text}
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
                  <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/HealthCare.svg?v=2" alt="HealthCare" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                  <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Banking & Finance.svg?v=2" alt="Banking & Finance" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                  <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Real-Estate.svg?v=2" alt="Real Estate" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Travel & Hospitality.svg?v=2" alt="Travel & Hospitality" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Media & Entertainment.svg?v=2" alt="Media & Entertainment" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/E-commerce & Retail.svg?v=2" alt="E-commerce & Retail" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Education & e-Learning.svg?v=2" alt="Education & e-Learning" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
                <img
              decoding="async"
              loading="lazy" className="industry-card__icon" src="/assets/icons/Food & Restaurant.svg?v=2" alt="Food & Restaurant" width="48" height="48" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
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
              {/* This alt said "GoodFirms rating" and the GoodFirms image
                  below said "Clutch rating" — the two were describing each
                  other's badge, and neither described Clutch. */}
              <img
              decoding="async"
              loading="lazy"
                className="review-stat__logo"
                src="/assets/upwork.webp"
                alt="Upwork 4.9 out of 5 review rating"
                width={347}
                height={68}
              />
            </div>


            {/* Splits the row into three, the way the footer's office panel
                does. Presentational, so it is hidden from assistive tech —
                the three cards are already separate elements there. */}
            <div className="reviews-bar__divider" aria-hidden="true" />
            <div className="review-stat review-stat--blue">
              <div className="trustpilot-card-inner">
                <div className="trustpilot-card-head">
                  <svg className="trustpilot-star-svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                    <path fill="#00b67a" d="M12 0l3.6 7.4L24 8.5l-6 5.8 1.4 8.3L12 18.7l-7.4 3.9L6 14.3 0 8.5l8.4-1.1L12 0z" />
                  </svg>
                  <span className="trustpilot-card-title">Trustpilot</span>
                </div>
                <div className="trustpilot-card-score">
                  <div className="stars" role="img" aria-label="Rated 5.0 out of 5 from 50 reviews">
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

            {/* Splits the row into three, the way the footer's office panel
                does. Presentational, so it is hidden from assistive tech —
                the three cards are already separate elements there. */}
            <div className="reviews-bar__divider" aria-hidden="true" />

            <div className="review-stat">
              <img
              decoding="async"
              loading="lazy"
                className="review-stat__logo"
                src="/assets/GoodFirms.webp"
                alt="GoodFirms 4.9 out of 5 review rating"
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
