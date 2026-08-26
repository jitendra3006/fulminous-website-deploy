import React from "react";
import { ContactCaptcha } from "@/components/ContactCaptcha";

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
              {/* Each width/height is the file's own intrinsic size. .hex-badge
                  img is width:100%/height:100% inside an auto-height box, so
                  these only hand the browser the aspect ratio to reserve before
                  the file decodes — the painted size is unchanged, and the row
                  no longer reflows as the three lazy badges arrive. */}
              <div className="hex-badges">
                <div className="hex-badge">
                  <img
              decoding="async"
              loading="lazy" src="/assets/BusinessFirms.webp" alt="BusinessFirms badge" width={355} height={400} />
                </div>
                <div className="hex-badge">
                  <img
              decoding="async"
              loading="lazy" src="/assets/iTRate.webp" alt="iTRate badge" width={400} height={452} />
                </div>
                <div className="hex-badge">
                  <img
              decoding="async"
              loading="lazy" src="/assets/SelectedFirms.webp" alt="SelectedFirms badge" width={354} height={400} />
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
              {/* The captcha and the submit travel together: the button has to be
                  able to refuse, so the state that decides lives with it. This
                  is the only client component in the section — the three fields
                  above stay server-rendered. */}
              <ContactCaptcha />
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
