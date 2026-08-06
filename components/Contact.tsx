import React from "react";

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__inner">
        <div className="contact__panel">
          <div className="contact__grid">
            <div className="contact__left">
              <p className="contact__eyebrow">Get in Touch</p>
              <h2 className="contact__title" id="contact-title">
                Let's build something <span>great together</span>.
              </h2>
              <p className="contact__text">
                Tell us about your project. You'll hear back from a senior engineer — not a
                salesperson — within 24 hours.
              </p>
              <div className="hex-badges">
                <div className="hex-badge">
                  <img src="/assets/BusinessFirms.png" alt="BusinessFirms badge" />
                </div>
                <div className="hex-badge">
                  <img src="/assets/iTRate.png" alt="iTRate badge" />
                </div>
                <div className="hex-badge">
                  <img src="/assets/SelectedFirms.png" alt="SelectedFirms badge" />
                </div>
              </div>
            </div>

            <div className="contact__form">
              <div className="contact__fields">
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-name">
                    Your Name
                  </label>
                  <input
                    className="contact__input contact__input--highlight"
                    id="contact-name"
                    type="text"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-email">
                    Work Email
                  </label>
                  <input
                    className="contact__input"
                    id="contact-email"
                    type="email"
                    placeholder="Jane@company.com"
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-brief">
                    Project brief
                  </label>
                  <textarea
                    className="contact__input contact__textarea"
                    id="contact-brief"
                    placeholder="A few sentences about what you're building, timelines, and team..."
                  />
                </div>
              </div>
              <button className="contact__submit" type="button">
                Get Free Proposal
              </button>
              <p className="contact__note">
                By submitting, you agree to our privacy terms. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
