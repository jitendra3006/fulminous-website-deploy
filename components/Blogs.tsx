/* No "use client": this file has no state, no effects and no handlers, so
   marking it a client component only shipped and hydrated its markup for
   nothing. ScrollGenerativeText carries its own "use client" via
   TechPartnerIntro, so importing it from here still gives that one child a
   client boundary — the rest of the section is now server-rendered HTML with
   no JS attached. */

import React from "react";
import { ScrollGenerativeText } from "./TechPartnerIntro";
import { live } from "@/lib/site-config";

/* The three cards are visual placeholders — same truncated title, same excerpt,
   and no article behind them. Their "Read More" was href="#", so each card
   offered a crawler a link to the top of the current page and offered a reader
   nothing. Rather than invent three article URLs, the affordance is now a
   <span> with the identical class: .blog-card__link sets display, font and
   colour explicitly and has no :hover rule, so the card renders exactly as
   before. Turn these back into <a href={...}> the moment real posts are wired
   up. The section CTA does have a real destination and keeps its link. */
function BlogCardAffordance() {
  return (
    <span className="blog-card__link">
      Read More
      <svg className="blog-card__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  );
}

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
          {/* Was href="#blogs" — the id of the section this button is inside.
              It now goes to the real blog index. */}
          <a
            className="btn btn--primary blogs__more"
            href={live("/blog")}
          >
            View more Blogs
          </a>
        </div>

        <div className="blogs__grid">
          <article className="blog-card">
            <div className="blog-card__image">
              {/* All three cards shared this one alt. Each now describes the
                  picture it is actually on, which is what alt is for. */}
              <img
              decoding="async"
              loading="lazy"
                src="/next-assets/Blog-1.webp"
                alt="Three colleagues smiling over a laptop in a bright open-plan office"
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
            <BlogCardAffordance />
          </article>

          <article className="blog-card">
            <div className="blog-card__image blog-card__image--shadow">
              <img
              decoding="async"
              loading="lazy"
                src="/next-assets/Blog-2.webp"
                alt="Hand touching a hexagonal diagram of social engineering attack types"
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
            <BlogCardAffordance />
          </article>

          <article className="blog-card">
            <div className="blog-card__image">
              <img
              decoding="async"
              loading="lazy"
                src="/next-assets/Blog-3.webp"
                alt="Team reviewing a whiteboard of sticky notes during a sprint planning session"
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
            <BlogCardAffordance />
          </article>
        </div>
      </div>
    </section>
  );
}
