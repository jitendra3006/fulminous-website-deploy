import React from "react";

export function Cases() {
  return (
    <section className="cases" id="portfolio" aria-labelledby="cases-title">
      <div className="cases__inner">
        <div className="cases__head">
          <div className="cases__intro">
            <h2 className="cases__title" id="cases-title">
              Case Studies: Real Results Showcase
            </h2>
            <p className="cases__subtitle">
              See the case studies and portfolios of our successful software projects for
              different industries, highlighting our design approach, solutions, and the impact we
              create for businesses.
            </p>
          </div>
          <a className="btn btn--primary cases__more" href="#portfolio">
            View Case studies
          </a>
        </div>

        <div className="cases__body">
          <div className="cases__list">
            <article className="case-row">
              <div className="case-thumb case-thumb--green">
                <div className="case-thumb__shots">
                  <img className="case-thumb__shot case-thumb__shot--back-l" src="/assets/Trailmates-16.jpg" alt="" />
                  <img className="case-thumb__shot case-thumb__shot--back-r" src="/assets/Trailmates-18.jpg" alt="" />
                  <img
                    className="case-thumb__shot case-thumb__shot--front"
                    src="/assets/Trailmates-1.jpg"
                    alt="Trailmates app screenshot"
                  />
                </div>
              </div>
              <div className="case-info">
                <div className="case-info__head">
                  <p className="case-info__label">#Adventure Partner App</p>
                  <h3 className="case-info__title case-info__title--green">Trailmates</h3>
                </div>
                <p className="case-info__desc">
                  A user-friendly adventure companion platform developed by Fulminous Software. A
                  complete app solution for connecting travelers, planning activities, and amazing
                  outdoor experiences.
                </p>
                <a className="case-link" href="#">
                  Read More
                  <svg aria-hidden="true">
                    <use href="#icon-arrow-right" />
                  </svg>
                </a>
              </div>
            </article>

            <hr className="case-divider" />

            <article className="case-row">
              <div className="case-thumb case-thumb--orange">
                <div className="case-thumb__shots">
                  <img className="case-thumb__shot case-thumb__shot--back-l" src="/assets/Bingo-2.jpg" alt="" />
                  <img className="case-thumb__shot case-thumb__shot--back-r" src="/assets/Bingo-3.jpg" alt="" />
                  <img
                    className="case-thumb__shot case-thumb__shot--front"
                    src="/assets/Bingo-1.webp"
                    alt="Bingo game app screenshot"
                  />
                </div>
              </div>
              <div className="case-info">
                <div className="case-info__head">
                  <p className="case-info__label">#Bingo Game App</p>
                  <h3 className="case-info__title case-info__title--orange">Bingo</h3>
                </div>
                <p className="case-info__desc">
                  A highly engaging and profitable bingo game app developed by Fulminous Software.
                  The ultimate proof of our excellence in modern game development services.
                </p>
                <a className="case-link" href="#">
                  Read More
                  <svg aria-hidden="true">
                    <use href="#icon-arrow-right" />
                  </svg>
                </a>
              </div>
            </article>

            <hr className="case-divider" />
          </div>

          <div className="cases__featured">
            <div className="case-thumb case-thumb--blue">
              <div className="case-thumb__shots">
                <img className="case-thumb__shot case-thumb__shot--back-l" src="/assets/HotelOps-2.jpg" alt="" />
                <img className="case-thumb__shot case-thumb__shot--back-r" src="/assets/HotelOps-1.jpg" alt="" />
                <img
                  className="case-thumb__shot case-thumb__shot--front"
                  src="/assets/HotelOps-3.jpg"
                  alt="HotelOps website screenshot"
                />
              </div>
            </div>
            <div className="case-info">
              <div className="case-info__head">
                <p className="case-info__label">#Food Industry Website</p>
                <h3 className="case-info__title case-info__title--blue">HotelOps</h3>
              </div>
              <p className="case-info__desc">
                The perfect integration of technology and <br />
                the fitness industry to reach fitness <br />
                objectives with a wide variety of instructions <br />
                and recipes.
              </p>
              <a className="case-link" href="#">
                Read More
                <svg aria-hidden="true">
                  <use href="#icon-arrow-right" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
