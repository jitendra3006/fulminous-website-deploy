"use client";

import React from "react";
import { ScrollGenerativeText } from "./TechPartnerIntro";

export function Blogs() {
  return (
    <section className="blogs" id="blogs" aria-labelledby="blogs-title">
      <div className="blogs__inner">
        <div className="blogs__head">
          <div className="blogs__intro">
            <ScrollGenerativeText
              text="Latest Blogs And News"
              speed={30}
              delay={150}
              className="blogs__title"
              id="blogs-title"
              tag="h2"
            />
            <ScrollGenerativeText
              text="Our offshore IT consulting services, along with the AI-powered core, help top companies stay competitive, win new markets, and increase shareholder value."
              speed={18}
              delay={800}
              className="blogs__subtitle"
              tag="p"
            />
          </div>
          <a className="btn btn--primary blogs__more" href="#blogs">
            View more Blogs
          </a>
        </div>

        <div className="blogs__grid">
          <article className="blog-card">
            <div className="blog-card__image">
              <img
                src="/assets/Blog-1.png"
                alt="How to choose the right web design company"
                width={375}
                height={228}
              />
            </div>
            <div className="blog-card__text">
              <h3 className="blog-card__title">
                How To Choose The Right Web Design Company in South......
              </h3>
              <p className="blog-card__excerpt">
                Just in the USA, there are more than 190,486 web designers and companies...
              </p>
            </div>
            <a className="blog-card__link" href="#">
              Read More
              <svg className="blog-card__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </article>

          <article className="blog-card">
            <div className="blog-card__image blog-card__image--shadow">
              <img
                src="/assets/Blog-2.png"
                alt="How to choose the right web design company"
                width={375}
                height={228}
              />
            </div>
            <div className="blog-card__text">
              <h3 className="blog-card__title">
                How To Choose The Right Web Design Company in South.....
              </h3>
              <p className="blog-card__excerpt">
                Just in the USA, there are more than 190,486 web designers and companies...
              </p>
            </div>
            <a className="blog-card__link" href="#">
              Read More
              <svg className="blog-card__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </article>

          <article className="blog-card">
            <div className="blog-card__image">
              <img
                src="/assets/Blog-3.png"
                alt="How to choose the right web design company"
                width={375}
                height={228}
              />
            </div>
            <div className="blog-card__text">
              <h3 className="blog-card__title">
                How To Choose The Right Web Design Company in South.....
              </h3>
              <p className="blog-card__excerpt">
                Just in the USA, there are more than 190,486 web designers and companies...
              </p>
            </div>
            <a className="blog-card__link" href="#">
              Read More
              <svg className="blog-card__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
