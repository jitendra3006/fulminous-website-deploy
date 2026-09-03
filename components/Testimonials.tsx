import React from "react";

export function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="testimonials__inner">
        <div className="testimonials__head">
          <h2 className="testimonials__title" id="testimonials-title">
            What Our Clients Say About Us
          </h2>
          <p className="testimonials__subtitle">
            100+ clients from various industries and different parts of the world speak in one
            voice that Fulminous Software is the best technology services provider.
          </p>
        </div>

        <div className="testimonials__grid">
          <div className="testimonials__col">
            <article className="tquote">
              <div className="tquote__top">
                <div className="stars" role="img" aria-label="Rated 5 out of 5 stars">
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                </div>
                <svg className="tquote__mark" viewBox="0 0 30 24" aria-hidden="true">
                  <path
                    d="M13 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8h-8v-5zM0 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8H0v-5z"
                    fill="#e2e2e2"
                  />
                </svg>
              </div>
              <p className="tquote__text">
                “In the last 4 years, our journey with Fulminous Software has transformed the
                business idea into real-world ROI. They developed a modern e-commerce website,
                considering all my demands and suggestions. We trust them because they deliver
                top-quality work, respond quickly, and always follow the latest trends in the
                e-commerce sector.”
              </p>
            </article>
            <article className="tphoto tphoto--h403">
              <img
              decoding="async"
              loading="lazy"
                className="tphoto__img"
                src="/next-assets/Brett McCammon.webp"
                alt="Portrait of Brett McCammon" width={528} height={760} />
              <div className="tphoto__meta">
                <p className="tphoto__name">Brett McCammon</p>
                <p className="tphoto__role">Managing Director</p>
              </div>
            </article>
          </div>

          <div className="testimonials__col">
            <article className="tphoto tphoto--h403">
              <img
              decoding="async"
              loading="lazy"
                className="tphoto__img"
                src="/next-assets/Heung jun Kwon.webp"
                alt="Portrait of Heung jun Kwon" width={530} height={760} />
              <div className="tphoto__meta">
                <p className="tphoto__name">Heung jun Kwon</p>
                <p className="tphoto__role">Head of Marketing Team</p>
              </div>
            </article>
            <article className="tquote">
              <div className="tquote__top">
                <div className="stars" role="img" aria-label="Rated 5 out of 5 stars">
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                </div>
                <svg className="tquote__mark" viewBox="0 0 30 24" aria-hidden="true">
                  <path
                    d="M13 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8h-8v-5zM0 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8H0v-5z"
                    fill="#e2e2e2"
                  />
                </svg>
              </div>
              <p className="tquote__text">
                “As a startup entrepreneur, the tie-up with Fulminous Software has been a strong
                support. Since I planned to launch a new taxi booking app, the experts from
                Fulmious Software guided me. They know exactly how to turn business plans into
                successful mobile apps. Beyond some coding skills, we value their creativity,
                professionalism, and commitment to helping our business grow.”
              </p>
            </article>
          </div>

          <div className="testimonials__col">
            <article className="tquote">
              <div className="tquote__top">
                <div className="stars" role="img" aria-label="Rated 5 out of 5 stars">
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                </div>
                <svg className="tquote__mark" viewBox="0 0 30 24" aria-hidden="true">
                  <path
                    d="M13 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8h-8v-5zM0 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8H0v-5z"
                    fill="#e2e2e2"
                  />
                </svg>
              </div>
              <p className="tquote__text">
                “In 2024, we collaborated with Fulminous Software, and they developed a
                top-quality healthcare AI chatbot for our hospital chains. Their AI chatbot
                completely changed the way we serve patients. We trust them because they offer
                practical solutions, long-term support, and meet all our needs”
              </p>
            </article>
            <article className="tphoto tphoto--h427">
              <img
              decoding="async"
              loading="lazy"
                className="tphoto__img"
                src="/next-assets/Kwame Duah.webp"
                alt="Portrait of Kwame Duah" width={500} height={760} />
              <div className="tphoto__meta">
                <p className="tphoto__name">Kwame Duah</p>
                <p className="tphoto__role">COO &amp; Manager</p>
              </div>
            </article>
          </div>

          <div className="testimonials__col">
            <article className="tphoto tphoto--h401">
              <img
              decoding="async"
              loading="lazy"
                className="tphoto__img"
                src="/next-assets/Carla Vernón.webp"
                alt="Portrait of Carla Vernón" width={532} height={760} />
              <div className="tphoto__meta">
                <p className="tphoto__name">Carla Vernón</p>
                <p className="tphoto__role">CEO &amp; Board Director</p>
              </div>
            </article>
            <article className="tquote">
              <div className="tquote__top">
                <div className="stars" role="img" aria-label="Rated 5 out of 5 stars">
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                  <svg className="stars__icon">
                    <use href="#icon-star" />
                  </svg>
                </div>
                <svg className="tquote__mark" viewBox="0 0 30 24" aria-hidden="true">
                  <path
                    d="M13 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8h-8v-5zM0 22c0-7 3-12 9-14l1 3c-4 2-6 5-6 8h4v8H0v-5z"
                    fill="#e2e2e2"
                  />
                </svg>
              </div>
              <p className="tquote__text">
                “The proficiency of Fulminous Software in grasping what we imagine and placing
                them in a modern technology framework is worth appreciating. We never imagined that
                Fulminous Software could turn our game concepts into a highly profitable game app
                with trending features. Even though we are thankful for their game monetization
                strategies and regular maintenance support.”
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
